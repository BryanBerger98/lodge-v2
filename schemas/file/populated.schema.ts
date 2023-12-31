import { z } from 'zod';

import { UserSchema } from '../user';

import { FileSchema } from '.';

export const FilePopulatedSchema = FileSchema.extend({
	created_by: UserSchema.nullable(),
	updated_by: UserSchema.nullable(),
});

export interface IFilePopulated extends z.infer<typeof FilePopulatedSchema> {};