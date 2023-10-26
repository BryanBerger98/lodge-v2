import { PopulateOptions } from 'mongoose';

import { SettingDataType } from '@/schemas/setting';

import SettingModels from './setting.model';

export const populateSetting = (settingDataType: SettingDataType): PopulateOptions[] => {
	return [
		{
			path: 'created_by',
			select: { password: 0 },
		},
		{
			path: 'updated_by',
			select: { password: 0 },
		},
		{
			path: 'value',
			model: SettingModels[ settingDataType ], 
		},
	];
};