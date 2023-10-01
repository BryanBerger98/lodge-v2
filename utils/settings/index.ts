import { UnregisteredSetting } from '@/types/setting.type';

// export const BRAND_LINK_COLOR_SETTING = 'brand_link_color';
// export const BRAND_BACKGROUND_COLOR_SETTING = 'brand_background_color';
// export const BRAND_FONT_SETTING = 'brand_font';
// export const BRAND_FONT_SIZE_SETTING = 'brand_font_size';
// export const BRAND_FONT_WEIGHT_SETTING = 'brand_font_weight';
// export const BRAND_FONT_COLOR_SETTING = 'brand_font_color';

export const SETTING_NAMES = {
	// --- SHARE SETTINGS ---
	SHARE_WITH_ADMIN_SETTING: 'share_with_admin',
	OWNER_SETTING: 'owner',
	// --- USER SETTINGSS ---
	NEW_USERS_SIGNUP_SETTING: 'new_users_signup',
	USER_VERIFY_EMAIL_SETTING: 'user_verify_email',
	USER_ACCOUNT_DELETION_SETTING: 'user_account_deletion',
	// --- AUTH SETTINGS ---
	// Password settings
	PASSWORD_UPPERCASE_MIN_SETTING: 'password_uppercase_min',
	PASSWORD_LOWERCASE_MIN_SETTING: 'password_lowercase_min',
	PASSWORD_NUMBERS_MIN_SETTING: 'password_numbers_min',
	PASSWORD_SYMBOLS_MIN_SETTING: 'password_symbols_min',
	PASSWORD_MIN_LENGTH_SETTING: 'password_min_length',
	PASSWORD_UNIQUE_CHARS_SETTING: 'password_unique_chars',
	// Sign up / Signin settings
	MAGIC_LINK_SIGNIN_SETTING: 'magic_link_signin',
	GOOGLE_AUTH_SETTING: 'google_auth',
	APPLE_AUTH_SETTING: 'apple_auth',
	// --- BRANDING SETTINGS ---
	BRAND_NAME_SETTING: 'brand_name',
	BRAND_LOGO_SETTING: 'brand_logo',
	BRAND_FAVICON_SETTING: 'brand_favicon',
	BRAND_PRIMARY_COLOR_SETTING: 'brand_primary_color',
	BRAND_SECONDARY_COLOR_SETTING: 'brand_secondary_color',
	BRAND_WARNING_COLOR_SETTING: 'brand_warning_color',
	BRAND_DANGER_COLOR_SETTING: 'brand_danger_color',
	BRAND_INFO_COLOR_SETTING: 'brand_info_color',
	BRAND_SUCCESS_COLOR_SETTING: 'brand_success_color',
	BRAND_LIGHT_COLOR_SETTING: 'brand_light_color',
	BRAND_DARK_COLOR_SETTING: 'brand_dark_color',
} as const;

export const SETTING_TYPES = {
	BOOLEAN: 'boolean',
	STRING: 'string',
	NUMBER: 'number',
	OBJECT_ID: 'object_id',
	DATE: 'date',
	IMAGE: 'image',
} as const;

export const SETTING_NAME_TYPE = {
	[ SETTING_NAMES.SHARE_WITH_ADMIN_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.OWNER_SETTING ]: SETTING_TYPES.OBJECT_ID,
	[ SETTING_NAMES.NEW_USERS_SIGNUP_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.USER_VERIFY_EMAIL_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.USER_ACCOUNT_DELETION_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING ]: SETTING_TYPES.NUMBER,
	[ SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING ]: SETTING_TYPES.NUMBER,
	[ SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING ]: SETTING_TYPES.NUMBER,
	[ SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING ]: SETTING_TYPES.NUMBER,
	[ SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING ]: SETTING_TYPES.NUMBER,
	[ SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.MAGIC_LINK_SIGNIN_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.GOOGLE_AUTH_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.APPLE_AUTH_SETTING ]: SETTING_TYPES.BOOLEAN,
	[ SETTING_NAMES.BRAND_NAME_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_LOGO_SETTING ]: SETTING_TYPES.IMAGE,
	[ SETTING_NAMES.BRAND_FAVICON_SETTING ]: SETTING_TYPES.IMAGE,
	[ SETTING_NAMES.BRAND_PRIMARY_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_SECONDARY_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_WARNING_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_DANGER_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_INFO_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_SUCCESS_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_LIGHT_COLOR_SETTING ]: SETTING_TYPES.STRING,
	[ SETTING_NAMES.BRAND_DARK_COLOR_SETTING ]: SETTING_TYPES.STRING,
} as const;

export type SettingName = typeof SETTING_NAMES[ keyof typeof SETTING_NAMES ];
export type SettingNames = keyof typeof SETTING_NAMES;
export type SettingTypes = typeof SETTING_TYPES;
export type SettingNameTypes = typeof SETTING_NAME_TYPE;

export type SettingNameType<T = SettingName> = T extends keyof SettingNameTypes ? SettingNameTypes[ T ] : never;

export const DEFAULT_SETTINGS: UnregisteredSetting[] = [
	{
		name: SETTING_NAMES.SHARE_WITH_ADMIN_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.OWNER_SETTING,
		value: '',
		data_type: 'object_id',
	},
	{
		name: SETTING_NAMES.NEW_USERS_SIGNUP_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.USER_VERIFY_EMAIL_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.USER_ACCOUNT_DELETION_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.MAGIC_LINK_SIGNIN_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.GOOGLE_AUTH_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.APPLE_AUTH_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: SETTING_NAMES.BRAND_NAME_SETTING,
		value: 'Lodge',
		data_type: 'string',
	},
	{
		name: SETTING_NAMES.BRAND_LOGO_SETTING,
		value: null,
		data_type: 'image',
	},
];

export const findDefaultSettingByName = <T extends SettingName>(settingName: T): UnregisteredSetting<SettingNameType<T>> | undefined => {
	return DEFAULT_SETTINGS.find(({ name }) => name === settingName) as UnregisteredSetting<SettingNameType<T>> | undefined;
	// return SETTINGS[ settingName ];
};