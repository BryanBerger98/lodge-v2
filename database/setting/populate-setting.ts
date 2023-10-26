import { PopulateOptions } from 'mongoose';

import { SettingDataType } from '@/schemas/setting';

import SettingModels from './setting.model';

export const populateSetting = (settingDataType: SettingDataType): PopulateOptions[] => {
	const populateArray: PopulateOptions[] = [
		{
			path: 'created_by',
			select: { password: 0 },
		},
		{
			path: 'updated_by',
			select: { password: 0 },
		},
	];
	if ([ SettingDataType.OBJECT_ID, SettingDataType.IMAGE ].includes(settingDataType)) {
		populateArray.push({
			path: 'value',
			model: SettingModels[ settingDataType ], 
		});
	}
	return populateArray;
};