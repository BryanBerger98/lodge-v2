import { SettingName, SettingDataType } from '@/schemas/setting';
import { UnregisteredSettingPopulated } from '@/schemas/setting/unregistered-setting.schema';

import { DEFAULT_SETTINGS } from './default-settings.util';

export const SETTING_NAME_TYPE = {
	[ SettingName.SHARE_WITH_ADMIN ]: SettingDataType.STRING,
	[ SettingName.SHARE_WITH_ADMIN_USERS_LIST ]: SettingDataType.ARRAY_OF_OBJECT_IDS,
	[ SettingName.OWNER ]: SettingDataType.OBJECT_ID,
	[ SettingName.NEW_USERS_SIGNUP ]: SettingDataType.BOOLEAN,
	[ SettingName.USER_VERIFY_EMAIL ]: SettingDataType.BOOLEAN,
	[ SettingName.USER_ACCOUNT_DELETION ]: SettingDataType.BOOLEAN,
	[ SettingName.PASSWORD_UPPERCASE_MIN ]: SettingDataType.NUMBER,
	[ SettingName.PASSWORD_LOWERCASE_MIN ]: SettingDataType.NUMBER,
	[ SettingName.PASSWORD_NUMBERS_MIN ]: SettingDataType.NUMBER,
	[ SettingName.PASSWORD_SYMBOLS_MIN ]: SettingDataType.NUMBER,
	[ SettingName.PASSWORD_MIN_LENGTH ]: SettingDataType.NUMBER,
	[ SettingName.PASSWORD_UNIQUE_CHARS ]: SettingDataType.BOOLEAN,
	[ SettingName.MAGIC_LINK_SIGNIN ]: SettingDataType.BOOLEAN,
	[ SettingName.GOOGLE_AUTH ]: SettingDataType.BOOLEAN,
	[ SettingName.APPLE_AUTH ]: SettingDataType.BOOLEAN,
	[ SettingName.BRAND_NAME ]: SettingDataType.STRING,
	[ SettingName.BRAND_LOGO ]: SettingDataType.IMAGE,
	[ SettingName.BRAND_FAVICON ]: SettingDataType.IMAGE,
	// [ SettingName.BRAND_PRIMARY_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_SECONDARY_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_WARNING_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_DANGER_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_INFO_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_SUCCESS_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_LIGHT_COLOR ]: SettingDataType.STRING,
	// [ SettingName.BRAND_DARK_COLOR ]: SettingDataType.STRING,
} as const;
export type SettingNameTypes = typeof SETTING_NAME_TYPE;
export type SettingNameType<T = SettingName> = T extends keyof SettingNameTypes ? SettingNameTypes[ T ] : never;

export const findDefaultSettingByName = <T extends SettingName>(settingName: T): UnregisteredSettingPopulated<SettingNameType<T>> | undefined => {
	return DEFAULT_SETTINGS.find(({ name }) => name === settingName) as UnregisteredSettingPopulated<SettingNameType<T>> | undefined;
};