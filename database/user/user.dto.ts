import { z } from 'zod';

import { AuthProvider } from '@/schemas/auth-provider';
import { Role } from '@/schemas/role.schema';

const SignUpUserWithPasswordDTOSchema = z.object({
	email: z.string().email().min(1, 'Cannot be empty.'),
	password: z.string().min(1, 'Cannot be empty.'),
});

export const CreateUserDTOSchema = z.union([
	SignUpUserWithPasswordDTOSchema,
	z.object({
		username: z.string().min(1, 'Cannot be empty.'),
		email: z.string().email().min(1, 'Cannot be empty.'),
		phone_number: z.string().min(1, 'Cannot be empty.'),
		role: z.nativeEnum(Role),
		is_disabled: z.boolean(),
		provider_data: z.nativeEnum(AuthProvider),
		photo: z.string().nullable(),
		created_by: z.string().min(1, 'Cannot be empty.').nullable(),
	}),
]);

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>;

const UpdateUserDTOSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	username: z.string().min(1, 'Cannot be empty.').optional(),
	email: z.string().email().min(1, 'Cannot be empty.').optional(),
	phone_number: z.string().min(1, 'Cannot be empty.').optional(),
	role: z.nativeEnum(Role).optional(),
	is_disabled: z.boolean().optional(),
	updated_by: z.string().nullable(),
	has_email_verified: z.boolean().optional(),
	photo: z.string().nullable(),
	last_login_date: z.date().nullable(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTOSchema>;