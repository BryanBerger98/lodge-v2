import { z } from 'zod';

export const FetchUsersSchema = z.object({
	sort_fields: z.coerce.string().optional().transform(value => value ? value.split(',') : [ 'created_at' ]),
	sort_directions: z.coerce.string().optional().default('-1').transform(value => value.split(',').map(v => v ? Number(v) : -1)).refine(value => value.every(v => v === 1 || v === -1)),
	page_size: z.coerce.number().optional().default(10),
	page_index: z.coerce.number().optional().default(0),
	search: z.coerce.string().optional(),
	roles: z.coerce.string().optional().transform(value => value ? value.split(',') : [ 'user', 'admin', 'owner' ]),
});