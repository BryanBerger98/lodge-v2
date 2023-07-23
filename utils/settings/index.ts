import { UnregisteredSetting } from '@/types/setting.type';

// Share settings
export const SHARE_WITH_ADMIN_SETTING = 'share_with_admin';
export const OWNER_SETTING = 'owner';

// User settings
export const NEW_USERS_SIGNUP_SETTING = 'new_users_signup';
export const USER_VERIFY_EMAIL_SETTING = 'user_verify_email';
export const USER_ACCOUNT_DELETION_SETTING = 'user_account_deletion';

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
];