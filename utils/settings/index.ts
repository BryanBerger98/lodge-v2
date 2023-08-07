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
];

export const findDefaultSettingByName = (settingName: string) => {
	return DEFAULT_SETTINGS.find(({ name }) => name === settingName);
};