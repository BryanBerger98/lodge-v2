import { parse } from 'url';

import { NextRequest, NextResponse } from 'next/server';

import { hasSettingsAccess } from '@/app/_utils/settings/has-settings-access';
import { findSettings, updateSetting } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';

import { FetchSettingsSchema } from './_schemas/fetch-settings.schema';
import { UpdateSettingsSchema } from './_schemas/update-settings.schema';

export const PUT = routeHandler(async (request: NextRequest) => {
	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

	const hasUserSettingsAccess = hasSettingsAccess(currentUser);

	if (!hasUserSettingsAccess) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const body = await request.json();

	const { settings } = UpdateSettingsSchema.parse(body);

	if (settings.length === 0) {
		return NextResponse.json({ message: 'Nothing to update.' });
	}

	const settingsToUpdate = settings.filter(setting => setting.name !== SettingName.OWNER && setting.name !== SettingName.SHARE_WITH_ADMIN);
		
	for (const setting of settingsToUpdate) {
		await updateSetting({
			...setting,
			updated_by: currentUser.id,
		}, { upsert: true });
	}
		
	return NextResponse.json({ message: 'Updated.' });
});

export const GET = routeHandler(async (request) => {
	await connectToDatabase();

	const queryParams = parse(request.url, true).query;

	const { name } = FetchSettingsSchema.parse(queryParams);

	const query = name && name.length > 0 ? { name: { $in: name } } : {};
		
	const settings = await findSettings(query);
		
	return NextResponse.json({ settings });
});