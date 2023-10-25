import { z } from 'zod';

import { UserSchema } from './user';

export const FileSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	original_name: z.string().min(1, 'Cannot be empty.'),
	custom_name: z.string().optional(),
	mime_type: z.string().min(1, 'Cannot be empty.'),
	size: z.number().min(1, 'Cannot be empty.'),
	extention: z.string().optional(),
	key: z.string().min(1, 'Cannot be empty.'),
	url: z.string().min(1, 'Cannot be empty.'),
	url_expiration_date: z.date().nullable(),
	created_at: z.date().nullable(),
	updated_at: z.date().nullable(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable(),
	updated_by: z.string().min(1, 'Cannot be empty.').nullable(),
});
export type File = z.infer<typeof FileSchema>;

export const FilePopulatedSchema = FileSchema.extend({
	created_by: UserSchema.nullable(),
	updated_by: UserSchema.nullable(),
});
export type FilePopulated = z.infer<typeof FilePopulatedSchema>;