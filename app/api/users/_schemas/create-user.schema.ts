import { z } from 'zod';

import { UserRoles } from '@/types/user.type';

export const CreateUserSchema = z.object({
	username: z.coerce.string().min(1, 'Required.'),
	email: z.coerce.string().email('Please, provide a valid email address.').min(1, 'Required.'),
	phone_number: z.coerce.string(),
	role: z.enum(UserRoles).default('user'),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').default('false'),
});