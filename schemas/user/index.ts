import { z } from 'zod';

import { AuthProviderSchema } from '../auth-provider';
import { FileSchema } from '../file.schema';
import { RoleWithOwnerSchema } from '../role.schema';

import { GenderSchema } from './gender.schema';

export const UserSchema = z.object({
	id: z.coerce.string().min(1, 'Cannot be empty.'),
	email: z.coerce.string().email().min(1, 'Cannot be empty.'),
	has_email_verified: z.coerce.boolean(),
	first_name: z.coerce.string().nullable().optional(),
	last_name: z.coerce.string().nullable().optional(),
	role: RoleWithOwnerSchema,
	birth_date: z.coerce.date().nullable().optional(),
	gender: GenderSchema.optional(),
	username: z.coerce.string().nullable().optional(),
	display_name: z.coerce.string().nullable().optional(),
	phone_number: z.coerce.string().optional(),
	photo: z.coerce.string().nullable(),
	is_disabled: z.coerce.boolean(),
	provider_data: AuthProviderSchema,
	created_at: z.coerce.date().nullable(),
	updated_at: z.coerce.date().nullable(),
	created_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
	updated_by: z.coerce.string().min(1, 'Cannot be empty.').nullable(),
	last_login_date: z.coerce.date().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const UserWithPasswordSchema = UserSchema.extend({ password: z.string().min(1, 'Cannot be empty.').nullable() });
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;

export const UserPopulatedSchema = UserSchema.extend({
	created_by: UserSchema.nullable(),
	updated_by: UserSchema.nullable(),
	photo: FileSchema.nullable(),
});
export type UserPopulated = z.infer<typeof UserPopulatedSchema>;

export const UserPopulatedWithPasswordSchema = UserPopulatedSchema.extend({ password: z.string().min(1, 'Cannot be empty.').nullable() });
export type UserPopulatedWithPassword = z.infer<typeof UserPopulatedWithPasswordSchema>;