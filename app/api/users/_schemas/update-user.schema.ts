import { z } from 'zod';

import { UserRoles } from '@/types/user.type';

export const UpdateUserSchema = z.object({
	username: z.coerce.string().optional(),
	email: z.coerce.string().email('Please, provide a valid email address.').optional(),
	phone_number: z.coerce.string().optional(),
	role: z.enum(UserRoles).optional(),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').optional(),
	id: z.coerce.string().min(1, 'Required.'),
});