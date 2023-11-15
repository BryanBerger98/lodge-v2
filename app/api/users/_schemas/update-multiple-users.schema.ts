import { z } from 'zod';

export const UpdateMultipleUsersSchema = z.array(z.object({
	id: z.coerce.string(),
	is_disabled: z.coerce.boolean().optional(),
}));