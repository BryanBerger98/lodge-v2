import { findSettingByName } from '@/database/setting/setting.repository';
import { SettingName, UnregisteredSettingBooleanPopulated, UnregisteredSettingBooleanPopulatedSchema } from '@/schemas/setting';

export const getEnabledSignInProvidersSettings = async (): Promise<UnregisteredSettingBooleanPopulated[]> => {

	const credentialsSettingData = await findSettingByName(SettingName.CREDENTIALS_SIGNIN);
	const magicLinkSettingData = await findSettingByName(SettingName.MAGIC_LINK_SIGNIN);
	const googleAuthSettingData = await findSettingByName(SettingName.GOOGLE_AUTH);
	const appleAuthSettingData = await findSettingByName(SettingName.APPLE_AUTH);

	const credentialsSetting = UnregisteredSettingBooleanPopulatedSchema.parse(credentialsSettingData);
	const magicLinkSetting = UnregisteredSettingBooleanPopulatedSchema.parse(magicLinkSettingData);
	const googleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(googleAuthSettingData);
	const appleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(appleAuthSettingData);

	const enabledSettings: UnregisteredSettingBooleanPopulated[] = [];

	if (credentialsSetting.value) {
		enabledSettings.push(credentialsSetting);
	}

	if (magicLinkSetting.value) {
		enabledSettings.push(magicLinkSetting);
	}

	if (googleAuthSetting.value) {
		enabledSettings.push(googleAuthSetting);
	}

	if (appleAuthSetting.value) {
		enabledSettings.push(appleAuthSetting);
	}

	return enabledSettings;
};