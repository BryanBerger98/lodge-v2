import { z } from 'zod';

export const SignUpUserSchema = z.object({
	email: z.coerce.string().email('Please, provide a valid email address.').nonempty('Required.'),
	password: z.coerce.string().min(8, 'At least 8 characters.'),
});