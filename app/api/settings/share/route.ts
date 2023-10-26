import { NextRequest, NextResponse } from 'next/server';

import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { findOwnerUser, findUserById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { authenticateUserWithPassword, setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltError, sendBuiltErrorWithSchemaValidation, sendError } from '@/utils/error';
import { USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

import { UpdateShareSettingsSchema } from './_schemas/update-share-settings.schema';

export const GET = async () => {
	try {
		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER ] });

		const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);
		const ownerSetting = await findSettingByName(SettingName.OWNER);

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
					name: SettingName.SHARE_WITH_ADMIN,
					value: false,
					data_type: SettingDataType.BOOLEAN,
				},
				owner: ownerSetting ?? {
					name: SettingName.OWNER,
					value: ownerUser.id,
					data_type: SettingDataType.OBJECT_ID,
				},
			},
			ownerUser,
		});
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}
};

export const PUT = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER ] });

		const body = await request.json();

		const { settings: settingsToUpdate, password } = UpdateShareSettingsSchema.parse(body);

		if (settingsToUpdate.length === 0) {
			return NextResponse.json({ message: 'Nothing to update.' });
		}

		await authenticateUserWithPassword(currentUser, password);

		const ownerSetting = settingsToUpdate.find(setting => setting.name === SettingName.OWNER);

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
				role: Role.ADMIN,
			});
			await updateUser({
				id: newOwnerUser.id,
				updated_by: currentUser.id,
				role: Role.OWNER,
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
		return sendBuiltErrorWithSchemaValidation(error);
	}
};