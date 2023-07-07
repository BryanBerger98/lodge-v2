import { object, string, z } from 'zod';

import { Id } from '@/config/database.config';
import { IUser, UserRole } from '@/types/user.type';

export const SignUpUserSchema = object({
	email: string().email('Please, provide a valid email address.').min(1, 'Required.'),
	password: string().min(8, 'At least 8 characters.'),
});

export type SignupUserDTO = z.infer<typeof SignUpUserSchema>;

export type CreateUserDTO = {
	username: string;
	email: string;
	phone_number: string;
	role: UserRole;
	provider_data: 'email';
	created_by?: Id | string | null;
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

export type UpdateUserDTO = Partial<IUser> & {
	id: string | Id;
};