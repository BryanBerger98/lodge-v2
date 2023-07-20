import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { findOwnerUser } from '@/database/user/user.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { OWNER_SETTING, SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

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