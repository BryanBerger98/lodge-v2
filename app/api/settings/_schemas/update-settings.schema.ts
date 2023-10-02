import { z } from 'zod';

import { SettingDataTypes } from '@/types/setting.type';

export const UpdateSettingsSchema = z.object({
	settings: z.array(z.object({
		name: z.coerce.string().nonempty('Required.'),
		value: z.any(),
		data_type: z.enum(SettingDataTypes),
		id: z.string().optional(),
	})).default([]), 
});