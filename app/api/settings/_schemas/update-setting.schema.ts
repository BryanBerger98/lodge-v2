import { z } from 'zod';

import { SettingDataType } from '@/schemas/setting';

export const UpdateSettingSchema = z.object({
	name: z.coerce.string().min(1, 'Cannot be empty'),
	value: z.any(),
	data_type: z.nativeEnum(SettingDataType),
	id: z.string().optional(),
});