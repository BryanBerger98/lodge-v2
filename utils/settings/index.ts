import { UnregisteredSetting } from '@/types/setting.type';

// Share settings
export const SHARE_WITH_ADMIN_SETTING = 'share_with_admin';
export const OWNER_SETTING = 'owner';

// User settings
export const USER_EMAIL_VERIFICATION_SETTING = 'user_email_verification';


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
];