import { z } from 'zod';

import { SettingDataType } from '@/schemas/setting';

export const UpdateSettingsSchema = z.object({
	settings: z.array(z.object({
		name: z.coerce.string().nonempty('Required.'),
		value: z.any(),
		data_type: z.nativeEnum(SettingDataType),
		id: z.string().optional(),
	})).default([]), 
});