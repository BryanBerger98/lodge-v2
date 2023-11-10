import { z } from 'zod';

import { MimeTypeSchema } from './mime-type.schema';

export const FileSchema = z.object({
	id: z.coerce.string().min(1, 'Cannot be empty.'),
	original_name: z.coerce.string(),
	custom_name: z.coerce.string().optional(),
	mime_type: MimeTypeSchema,
	size: z.coerce.number(),
	extension: z.coerce.string().optional(),
	key: z.coerce.string().min(1, 'Cannot be empty.'),
	url: z.coerce.string().min(1, 'Cannot be empty.'),
	url_expiration_date: z.date().nullable(),
	created_at: z.coerce.date().nullable(),
	updated_at: z.coerce.date().nullable(),
	created_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
	updated_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
});
export type IFile = z.infer<typeof FileSchema>;