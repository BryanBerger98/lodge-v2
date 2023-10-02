import { SettingDataType } from '@/types/setting.type';

export type CreateSettingDTO = {
	name: string;
	value?: any;
	data_type: SettingDataType;
	created_by: string | null;
}

export type UpdateSettingDTO = {
	name: string;
	value?: any;
	data_type: SettingDataType;
	updated_by: string | null;
}