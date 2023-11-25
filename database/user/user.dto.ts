import { z } from 'zod';

import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { Role } from '@/schemas/role.schema';

const SignUpUserWithPasswordDTOSchema = z.object({
	email: z.string().email().min(1, 'Cannot be empty.'),
	password: z.string().min(1, 'Cannot be empty.'),
});

export const CreateUserDTOSchema = SignUpUserWithPasswordDTOSchema.or(z.object({
	username: z.string().optional().nullable(),
	email: z.string().email().min(1, 'Cannot be empty.'),
	phone_number: z.string().optional(),
	role: z.nativeEnum(Role),
	is_disabled: z.boolean(),
	provider_data: z.nativeEnum(AuthenticationProvider),
	photo: z.string().nullable(),
	has_password: z.boolean(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable(),
}));

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>;

const UpdateUserDTOSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	username: z.string().optional().nullable(),
	email: z.string().email().min(1, 'Cannot be empty.').optional(),
	new_email: z.string().email().nullable().optional(),
	phone_number: z.string().optional(),
	role: z.nativeEnum(Role).optional(),
	is_disabled: z.boolean().optional(),
	updated_by: z.string().nullable(),
	has_email_verified: z.boolean().optional(),
	photo: z.string().nullable().optional(),
	last_login_date: z.date().nullable().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTOSchema>;