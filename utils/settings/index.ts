import { UnregisteredSetting } from '@/types/setting.type';

// Share settings
export const SHARE_WITH_ADMIN_SETTING = 'share_with_admin';
export const OWNER_SETTING = 'owner';

// User settings
export const NEW_USERS_SIGNUP_SETTING = 'new_users_signup';
export const USER_VERIFY_EMAIL_SETTING = 'user_verify_email';
export const USER_ACCOUNT_DELETION_SETTING = 'user_account_deletion';

// Auth settings

// Password settings
export const PASSWORD_UPPERCASE_MIN_SETTING = 'password_uppercase_min';
export const PASSWORD_LOWERCASE_MIN_SETTING = 'password_lowercase_min';
export const PASSWORD_NUMBERS_MIN_SETTING = 'password_numbers_min';
export const PASSWORD_SYMBOLS_MIN_SETTING = 'password_symbols_min';
export const PASSWORD_MIN_LENGTH_SETTING = 'password_min_length';
export const PASSWORD_UNIQUE_CHARS_SETTING = 'password_unique_chars';

// Sign up / Signin settings
export const MAGIC_LINK_SIGNIN_SETTING = 'magic_link_signin';
export const GOOGLE_AUTH_SETTING = 'google_auth';
export const APPLE_AUTH_SETTING = 'apple_auth';

// Branding settings
export const BRAND_NAME_SETTING = 'brand_name';
export const BRAND_LOGO_SETTING = 'brand_logo';
export const BRAND_FAVICON_SETTING = 'brand_favicon';
export const BRAND_PRIMARY_COLOR_SETTING = 'brand_primary_color';
export const BRAND_SECONDARY_COLOR_SETTING = 'brand_secondary_color';
export const BRAND_WARNING_COLOR_SETTING = 'brand_warning_color';
export const BRAND_DANGER_COLOR_SETTING = 'brand_danger_color';
export const BRAND_INFO_COLOR_SETTING = 'brand_info_color';
export const BRAND_SUCCESS_COLOR_SETTING = 'brand_success_color';
export const BRAND_LIGHT_COLOR_SETTING = 'brand_light_color';
export const BRAND_DARK_COLOR_SETTING = 'brand_dark_color';
// export const BRAND_LINK_COLOR_SETTING = 'brand_link_color';
// export const BRAND_BACKGROUND_COLOR_SETTING = 'brand_background_color';
// export const BRAND_FONT_SETTING = 'brand_font';
// export const BRAND_FONT_SIZE_SETTING = 'brand_font_size';
// export const BRAND_FONT_WEIGHT_SETTING = 'brand_font_weight';
// export const BRAND_FONT_COLOR_SETTING = 'brand_font_color';

export const DEFAULT_SETTINGS: UnregisteredSetting[] = [
	{
		name: SHARE_WITH_ADMIN_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: OWNER_SETTING,
		value: '',
		data_type: 'objectId',
	},
	{
		name: NEW_USERS_SIGNUP_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: USER_VERIFY_EMAIL_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: USER_ACCOUNT_DELETION_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: MAGIC_LINK_SIGNIN_SETTING,
		value: true,
		data_type: 'boolean',
	},
	{
		name: GOOGLE_AUTH_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: APPLE_AUTH_SETTING,
		value: false,
		data_type: 'boolean',
	},
	{
		name: BRAND_NAME_SETTING,
		value: 'Lodge',
		data_type: 'string',
	},
];

export const findDefaultSettingByName = (settingName: string) => {
	return DEFAULT_SETTINGS.find(({ name }) => name === settingName);
};