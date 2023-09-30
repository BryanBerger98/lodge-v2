import { z } from 'zod';

import { SettingTypes } from '@/types/setting.type';

export const UpdateSettingsSchema = z.object({
	settings: z.array(z.object({
		name: z.coerce.string().nonempty('Required.'),
		value: z.any(),
		data_type: z.enum(SettingTypes),
		id: z.string().optional(),
	})).default([]), 
});