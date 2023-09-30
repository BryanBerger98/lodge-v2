import { z } from 'zod';

export const UpdateUserEmailSchema = z.object({
	email: z.coerce.string().email('Please, provide a valid email address.').min(1, 'Required.'),
	password: z.coerce.string().min(1, 'Required.'),
});