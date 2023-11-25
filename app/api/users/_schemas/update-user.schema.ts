import { z } from 'zod';

import { Role } from '@/schemas/role.schema';
import { Gender } from '@/schemas/user/gender.schema';

export const UpdateUserSchema = z.object({
	username: z.coerce.string().optional(),
	email: z.coerce.string().email('Please, provide a valid email address.').optional(),
	phone_number: z.coerce.string().optional(),
	role: z.nativeEnum(Role).optional(),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').optional(),
	avatar: z.string().or(z.instanceof(Blob)).optional(),
	first_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	last_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	birth_date: z.coerce.date().optional(),
	gender: z.nativeEnum(Gender).optional(),
});