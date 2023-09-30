import { SettingType } from '@/types/setting.type';

export type CreateSettingDTO = {
	name: string;
	value?: any;
	data_type: SettingType;
	created_by: string | null;
}

export type UpdateSettingDTO = {
	name: string;
	value?: any;
	data_type: SettingType;
	updated_by: string | null;
}