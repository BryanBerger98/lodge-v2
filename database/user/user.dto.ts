import { object, string, z } from 'zod';

import { Id } from '@/lib/database';
import { AuthProvider, UserRoleWithOwner, UserRoles } from '@/types/user.type';

export const FetchUsersSchema = object({
	sort_fields: z.coerce.string().optional().transform(value => value ? value.split(',') : [ 'created_at' ]),
	sort_directions: z.coerce.string().optional().default('-1').transform(value => value.split(',').map(v => v ? Number(v) : -1)).refine(value => value.every(v => v === 1 || v === -1)),
	page_size: z.coerce.number().optional().default(10),
	page_index: z.coerce.number().optional().default(0),
	search: z.coerce.string().optional(),
	roles: z.string().optional().transform(value => value ? value.split(',') : [ 'user', 'admin', 'owner' ]),
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

export type CreateUserDTO = z.infer<typeof CreateUserSchema> & {
	provider_data: AuthProvider,
	created_by: Id | string | null;
	photo_key: string | null;
	has_password: boolean;
};

export const UpdateUserSchema = object({
	username: string().optional(),
	email: string().email('Please, provide a valid email address.').optional(),
	phone_number: string().optional(),
	role: z.enum(UserRoles).optional(),
	is_disabled: z.enum([ 'true', 'false' ]).transform(value => value === 'true').optional(),
	id: string().min(1, 'Required.'),
});

export type UpdateUserDTO = Omit<z.infer<typeof UpdateUserSchema>, 'id' | 'role'> & {
	id: Id | string;
	role?: UserRoleWithOwner,
	updated_by: Id | string | null;
	has_email_verified?: boolean;
	photo_key?: string | null;
	last_login_date?: Date | null;
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