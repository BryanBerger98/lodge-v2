import { z } from 'zod';

import { Id } from '@/config/database.config';
import { SettingTypes } from '@/types/setting.type';

export const CreateSettingSchema = z.object({
	name: z.string().min(1, 'Required.'),
	value: z.any(),
	data_type: z.enum(SettingTypes),
});

export type CreateSettingDTO = z.infer<typeof CreateSettingSchema> & {
	created_by: Id | string | null;
};

export const UpdateSettingSchema = z.object({
	name: z.string().min(1, 'Required.'),
	value: z.any(),
	data_type: z.enum(SettingTypes),
	id: z.string().optional(),
});

export type UpdateSettingDTO = z.infer<typeof UpdateSettingSchema> & {
	updated_by: Id | string;
};

export const UpdateSettingsSchema = z.object({ settings: z.array(UpdateSettingSchema).default([]) });

export const UpdateShareSettingsSchema = z.object({
	settings: z.array(UpdateSettingSchema).default([]),
	password: z.string().min(1, 'Required.'),
});