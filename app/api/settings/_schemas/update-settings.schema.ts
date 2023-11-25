import { z } from 'zod';

import { SettingDataType, SettingName } from '@/schemas/setting';

export const UpdateSettingsSchema = z.object({
	settings: z.array(z.object({
		name: z.nativeEnum(SettingName),
		value: z.any(),
		data_type: z.nativeEnum(SettingDataType),
		id: z.string().optional(),
	})).default([]), 
});