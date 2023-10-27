import { z } from 'zod';

import { Role } from '@/schemas/role.schema';

export const UpdateUserSchema = z.object({
	username: z.coerce.string().optional(),
	email: z.coerce.string().email('Please, provide a valid email address.').optional(),
	phone_number: z.coerce.string().optional(),
	role: z.nativeEnum(Role).optional(),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').optional(),
});