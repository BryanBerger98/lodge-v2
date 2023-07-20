import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { UpdateSettingsSchema } from '@/database/setting/setting.dto';
import { findSettingByName, updateSetting } from '@/database/setting/setting.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR } from '@/utils/error/error-codes';
import { SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

export const PUT = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const shareWithAdminSetting = await findSettingByName(SHARE_WITH_ADMIN_SETTING);

		const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

		const body = await request.json();

		const settingsToUpdate = UpdateSettingsSchema.parse(body);

		if (settingsToUpdate.length === 0) {
			return NextResponse.json({ message: 'Nothing to update.' });
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
			code: INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};