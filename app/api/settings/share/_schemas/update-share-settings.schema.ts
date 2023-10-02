import { z } from 'zod';

import { SettingDataTypes } from '@/types/setting.type';

export const UpdateShareSettingsSchema = z.object({
	settings: z.array(z.object({
		name: z.coerce.string().nonempty('Required.'),
		value: z.any(),
		data_type: z.enum(SettingDataTypes),
		id: z.string().optional(),
	})).default([]),
	password: z.coerce.string().nonempty('Required.'),
});