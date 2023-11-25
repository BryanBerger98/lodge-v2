import { z } from 'zod';

import { Role } from '@/schemas/role.schema';
import { Gender } from '@/schemas/user/gender.schema';

export const CreateUserSchema = z.object({
	avatar: z.string().or(z.instanceof(Blob)).optional(),
	username: z.coerce.string().optional(),
	first_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	last_name: z.coerce.string({ required_error: 'Required.' }).min(1, 'Required.'),
	email: z.coerce.string().email('Please, provide a valid email address.').min(1, 'Required.'),
	phone_number: z.coerce.string().optional(),
	birth_date: z.coerce.date().optional(),
	gender: z.nativeEnum(Gender).default(Gender.UNSPECIFIED),
	role: z.nativeEnum(Role).default(Role.USER),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').default('false'),
});