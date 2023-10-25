import { parse } from 'url';

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { findSettingByName, findSettings, updateSetting } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR } from '@/utils/error/error-codes';
import { SETTING_NAMES } from '@/utils/settings';

import { FetchSettingsSchema } from './_schemas/fetch-settings.schema';
import { UpdateSettingsSchema } from './_schemas/update-settings.schema';

export const PUT = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const shareWithAdminSetting = await findSettingByName(SETTING_NAMES.SHARE_WITH_ADMIN_SETTING);

		const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList });

		const body = await request.json();

		const { settings } = UpdateSettingsSchema.parse(body);

		if (settings.length === 0) {
			return NextResponse.json({ message: 'Nothing to update.' });
		}

		const settingsToUpdate = settings.filter(setting => setting.name !== SETTING_NAMES.OWNER_SETTING && setting.name !== SETTING_NAMES.SHARE_WITH_ADMIN_SETTING);
		
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

export const GET = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		const queryParams = parse(request.url, true).query;

		const { name } = FetchSettingsSchema.parse(queryParams);

		const query = name && name.length > 0 ? { name: { $in: name } } : {};
		
		const settings = await findSettings(query);
		
		return NextResponse.json({ settings });
		
	} catch (error: any) {
		console.error(error);
		return sendError(buildError({
			code: error.code || INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};