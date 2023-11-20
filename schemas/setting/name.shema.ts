import { z } from 'zod';

export enum SettingName {
	// -- SHARE SETTINGS --
	SHARE_WITH_ADMIN = 'share_with_admin',
	SHARE_WITH_ADMIN_USERS_LIST = 'share_with_admin_users_list',
	OWNER = 'owner',

	// -- USER SETTINGS --
	NEW_USERS_SIGNUP = 'new_users_signup',
	DEFAULT_USER_ROLE = 'default_user_role',
	USER_VERIFY_EMAIL = 'user_verify_email',
	USER_ACCOUNT_DELETION = 'user_account_deletion',

	// -- PASSWORD SETTINGS --
	PASSWORD_UPPERCASE_MIN = 'password_uppercase_min',
	PASSWORD_LOWERCASE_MIN = 'password_lowercase_min',
	PASSWORD_NUMBERS_MIN = 'password_numbers_min',
	PASSWORD_SYMBOLS_MIN = 'password_symbols_min',
	PASSWORD_MIN_LENGTH = 'password_min_length',
	PASSWORD_UNIQUE_CHARS = 'password_unique_chars',

	// SIGN UP / SIGN IN SETTINGS
	MAGIC_LINK_SIGNIN = 'magic_link_signin',
	GOOGLE_AUTH = 'google_auth',
	APPLE_AUTH = 'apple_auth',

	// -- BRANDING SETTINGS --
	BRAND_NAME = 'brand_name',
	BRAND_LOGO = 'brand_logo',
	BRAND_FAVICON = 'brand_favicon',
};

export const SettingNameSchema = z.nativeEnum(SettingName);