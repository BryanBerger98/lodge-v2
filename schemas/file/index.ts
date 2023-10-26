import { z } from 'zod';

import { MimeTypeSchema } from './mime-type.schema';

export const FileSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	original_name: z.string().min(1, 'Cannot be empty.'),
	custom_name: z.string().optional(),
	mime_type: MimeTypeSchema,
	size: z.number().min(1, 'Cannot be empty.'),
	extension: z.string().optional(),
	key: z.string().min(1, 'Cannot be empty.'),
	url: z.string().min(1, 'Cannot be empty.'),
	url_expiration_date: z.date().nullable(),
	created_at: z.date().nullable(),
	updated_at: z.date().nullable(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable(),
	updated_by: z.string().min(1, 'Cannot be empty.').nullable(),
});
export type IFile = z.infer<typeof FileSchema>;