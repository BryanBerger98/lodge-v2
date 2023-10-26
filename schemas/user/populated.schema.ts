import { z } from 'zod';

import { FileSchema } from '../file';

import { UserSchema } from '.';

export const UserPopulatedSchema = UserSchema.extend({
	created_by: UserSchema.nullable(),
	updated_by: UserSchema.nullable(),
	photo: FileSchema.nullable(),
});
export type UserPopulated = z.infer<typeof UserPopulatedSchema>;

export const UserPopulatedWithPasswordSchema = UserPopulatedSchema.extend({ password: z.string().min(1, 'Cannot be empty.').nullable() });
export type UserPopulatedWithPassword = z.infer<typeof UserPopulatedWithPasswordSchema>;