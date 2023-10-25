import { z } from 'zod';

import { SettingDataTypes } from '@/types/setting.type';

export const UpdateSettingSchema = z.object({
	name: z.coerce.string().nonempty('Required.'),
	value: z.any(),
	data_type: z.enum(SettingDataTypes),
	id: z.string().optional(),
});