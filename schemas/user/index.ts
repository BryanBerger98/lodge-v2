import { z } from 'zod';

import { AuthenticationProviderSchema } from '../authentication-provider';
import { RoleSchema } from '../role.schema';

import { GenderSchema } from './gender.schema';

export const UserSchema = z.object({
	id: z.coerce.string().min(1, 'Cannot be empty.'),
	email: z.coerce.string().email().min(1, 'Cannot be empty.'),
	new_email: z.coerce.string().email().nullable().optional(),
	has_email_verified: z.coerce.boolean(),
	first_name: z.coerce.string().nullable().optional(),
	last_name: z.coerce.string().nullable().optional(),
	role: RoleSchema,
	birth_date: z.coerce.date().nullable().optional(),
	gender: GenderSchema.optional(),
	username: z.coerce.string().nullable().optional(),
	display_name: z.coerce.string().nullable().optional(),
	phone_number: z.coerce.string().optional(),
	photo: z.coerce.string().nullable(),
	is_disabled: z.coerce.boolean(),
	provider_data: AuthenticationProviderSchema,
	created_at: z.coerce.date().nullable(),
	updated_at: z.coerce.date().nullable(),
	created_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
	updated_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
	last_login_date: z.coerce.date().nullable(),
	has_password: z.coerce.boolean(),
});
export interface User extends z.infer<typeof UserSchema> {};

export const UserWithPasswordSchema = UserSchema.extend({ password: z.string().min(1, 'Cannot be empty.').nullable() });
export interface IUserWithPassword extends z.infer<typeof UserWithPasswordSchema> {};