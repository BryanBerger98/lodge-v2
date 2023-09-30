import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { findOwnerUser, findUserById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { authenticateUserWithPassword, setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { OWNER_SETTING, SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

import { UpdateShareSettingsSchema } from './_schemas/update-share-settings.schema';

export const GET = async () => {
	try {
		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ 'owner' ] });

		const shareWithAdminSetting = await findSettingByName(SHARE_WITH_ADMIN_SETTING);
		const ownerSetting = await findSettingByName(OWNER_SETTING);

		const ownerUser = await findOwnerUser();

		if (!ownerUser) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		return NextResponse.json({
			settings: {
				shareWithAdmin: shareWithAdminSetting ?? {
					name: SHARE_WITH_ADMIN_SETTING,
					value: false,
					data_type: 'boolean',
				},
				owner: ownerSetting ?? {
					name: OWNER_SETTING,
					value: ownerUser.id,
					data_type: 'objectId',
				},
			},
			ownerUser,
		});
	} catch (error: any) {
		console.error(error);
		return sendError(buildError({
			code: INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};

export const PUT = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ 'owner' ] });

		const body = await request.json();

		const { settings: settingsToUpdate, password } = UpdateShareSettingsSchema.parse(body);

		if (settingsToUpdate.length === 0) {
			return NextResponse.json({ message: 'Nothing to update.' });
		}

		await authenticateUserWithPassword(currentUser, password);

		const ownerSetting = settingsToUpdate.find(setting => setting.name === OWNER_SETTING);

		if (ownerSetting?.value) {
			const prevOwnerUser = await findOwnerUser();
			const newOwnerUser = await findUserById(ownerSetting.value);
			if (!prevOwnerUser || !newOwnerUser) {
				return sendError(buildError({
					code: USER_NOT_FOUND_ERROR,
					message: 'User not found.',
					status: 404,
				}));
			}
			await updateUser({
				id: prevOwnerUser?.id,
				updated_by: currentUser.id,
				role: 'admin',
			});
			await updateUser({
				id: newOwnerUser.id,
				updated_by: currentUser.id,
				role: 'owner',
			});
		}

		for (const setting of settingsToUpdate) {
			await updateSetting({
				...setting,
				updated_by: currentUser.id,
			}, { upsert: true });
		}

		return NextResponse.json({ message: 'Updated.' });
		
	} catch (error: any) {
		console.error(error);
		if (error.name && error.name === 'ZodError') {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'Invalid input.',
				status: 422,
				data: error as ZodError,
			}));
		}
		return sendError(buildError({
			code: error.code || INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};