import { SettingDataType, SettingName, UnregisteredSettingPopulated } from '@/schemas/setting';

export const DEFAULT_SETTINGS: UnregisteredSettingPopulated[] = [
	{
		name: SettingName.SHARE_WITH_ADMIN,
		value: false,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.OWNER,
		value: '',
		data_type: SettingDataType.OBJECT_ID,
	},
	{
		name: SettingName.NEW_USERS_SIGNUP,
		value: true,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.USER_VERIFY_EMAIL,
		value: true,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.USER_ACCOUNT_DELETION,
		value: true,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.MAGIC_LINK_SIGNIN,
		value: true,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.GOOGLE_AUTH,
		value: false,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.APPLE_AUTH,
		value: false,
		data_type: SettingDataType.BOOLEAN,
	},
	{
		name: SettingName.BRAND_NAME,
		value: 'Lodge',
		data_type: SettingDataType.STRING,
	},
	{
		name: SettingName.BRAND_LOGO,
		value: null,
		data_type: SettingDataType.IMAGE,
	},
	{
		name: SettingName.BRAND_FAVICON,
		value: null,
		data_type: SettingDataType.IMAGE,
	},
	// {
	// 	name: SettingName.BRAND_PRIMARY_COLOR,
	// 	value: '#0F172A',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_SECONDARY_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_WARNING_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_DANGER_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_INFO_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_SUCCESS_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_LIGHT_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	// {
	// 	name: SettingName.BRAND_DARK_COLOR,
	// 	value: '#000000',
	// 	data_type: SettingDataType.STRING,
	// },
	{
		name: SettingName.PASSWORD_UPPERCASE_MIN,
		value: 0,
		data_type: SettingDataType.NUMBER,
	},
	{
		name: SettingName.PASSWORD_LOWERCASE_MIN,
		value: 0,
		data_type: SettingDataType.NUMBER,
	},
	{
		name: SettingName.PASSWORD_NUMBERS_MIN,
		value: 0,
		data_type: SettingDataType.NUMBER,
	},
	{
		name: SettingName.PASSWORD_SYMBOLS_MIN,
		value: 0,
		data_type: SettingDataType.NUMBER,
	},
	{
		name: SettingName.PASSWORD_MIN_LENGTH,
		value: 8,
		data_type: SettingDataType.NUMBER,
	},
	{
		name: SettingName.PASSWORD_UNIQUE_CHARS,
		value: false,
		data_type: SettingDataType.BOOLEAN,
	},
];