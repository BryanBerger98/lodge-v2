import { object, string, z } from 'zod';

import { Id } from '@/config/database.config';
import { AuthProvider, IUser, UserRoles } from '@/types/user.type';

export const FetchUsersSchema = object({
	sort_fields: z.coerce.string().transform(value => value.split(',')).optional().default('created_at'),
	sort_directions: z.coerce.string().transform(value => value.split(',').map(v => Number(v))).refine(value => value.every(v => v === 1 || v === -1)).optional().default('-1'),
	limit: z.coerce.number().optional().default(10),
	skip: z.coerce.number().optional().default(0),
	search: z.coerce.string().optional(),
});

export const SignUpUserSchema = object({
	email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
	password: string().min(8, 'At least 8 characters.'),
});

export type SignupUserDTO = z.infer<typeof SignUpUserSchema>;

export const CreateUserSchema = object({
	username: string().min(1, 'Required.'),
	email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
	phone_number: string(),
	role: z.enum(UserRoles).default('user'),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').default('false'),
});

export const UpdateUserSchema = object({
	username: string().optional(),
	email: string().email('Please, provide a valid email address.').optional(),
	phone_number: string().optional(),
	role: z.enum(UserRoles).optional(),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').optional(),
	id: string().min(1, 'Required.'),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema> & {
	provider_data: AuthProvider,
	created_by: Id | string;
	photo_key: string | null;
};

export const UpdateUserAccountSchema = object({
	username: string(),
	phone_number: string(),
})
	.partial()
	.refine(
		({ username, phone_number }) =>
			username !== undefined || phone_number !== undefined,
		{ message: 'Nothing to update' }
	);

export const UpdateUserEmailSchema = object({
	email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
	password: string().min(1, 'Required.'),
});

export const UpdateUserPasswordSchema = object({
	password: string().min(1, 'Required.'),
	newPassword: string().min(1, 'Required.'),
});

export type UpdateUserDTO = Partial<IUser> & {
	id: string | Id;
	updated_by: Id | string;
};