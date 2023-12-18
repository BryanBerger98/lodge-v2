import { NextResponse } from 'next/server';

import { getEnabledSignInProvidersSettings } from '@/app/_utils/settings/get-enabled-sign-in-providers-settings';
import { hasSettingsAccess } from '@/app/_utils/settings/has-settings-access';
import { findSettings, updateSetting } from '@/database/setting/setting.repository';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { StatusCode } from '@/utils/api/http-status';
import { SIGN_IN_SETTINGS_NAMES } from '@/utils/settings';

import { FetchSettingsSchema } from './_schemas/fetch-settings.schema';
import { UpdateSettingsSchema } from './_schemas/update-settings.schema';

export const PUT = routeHandler(async (request, { currentUser }) => {
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

	const enabledSignInProvidersSettings = await getEnabledSignInProvidersSettings();

	const falsySignInProvidersSettingsToUpdate = settingsToUpdate.filter(setting => SIGN_IN_SETTINGS_NAMES.includes(setting.name) && setting.value === false);

	if (enabledSignInProvidersSettings.length <= 1 && falsySignInProvidersSettingsToUpdate.length >= 1) {
		throw buildApiError({
			status: StatusCode.UNPROCESSABLE_ENTITY,
			message: 'At least one sign in provider must be enabled.', 
		});
	}
	
	for (const setting of settingsToUpdate) {
		await updateSetting({
			...setting,
			updated_by: currentUser.id,
		}, { upsert: true });
	}

	return NextResponse.json({ message: 'Updated.' });
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});

export const GET = routeHandler(async (_, { searchParams }) => {
	const { name } = FetchSettingsSchema.parse(searchParams);
	const query = name && name.length > 0 ? { name: { $in: name } } : {};
	const settings = await findSettings(query);
	return NextResponse.json({ settings });
});