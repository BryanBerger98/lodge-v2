import { z } from 'zod';

import { FileSchema } from '../file';

import { UserSchema } from '.';

export const UserPopulatedSchema = UserSchema.extend({
	created_by: UserSchema.nullable(),
	updated_by: UserSchema.nullable(),
	photo: FileSchema.nullable(),
});

export interface IUserPopulated extends z.infer<typeof UserPopulatedSchema> {};

export const UserPopulatedWithPasswordSchema = UserPopulatedSchema.extend({ password: z.string().min(1, 'Cannot be empty.').nullable() });
export interface IUserPopulatedWithPassword extends z.infer<typeof UserPopulatedWithPasswordSchema> {};