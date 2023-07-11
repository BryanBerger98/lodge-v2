import { Id } from '@/config/database.config';

export const UserRoles = [ 'admin', 'user' ] as const;
export type UserRole = typeof UserRoles[number];

export const AuthProviders = [ 'email', 'google', 'facebook', 'github', 'microsoft' ] as const;
export type AuthProvider = typeof AuthProviders[number];

export interface IUser {
	id: Id | string;
	email: string;
	has_email_verified: boolean;
	role: UserRole;
	username: string;
	phone_number: string;
	photo_url: string | null;
	photo_key: string | null;
	is_disabled: boolean;
	provider_data: AuthProvider;
	created_at: Date;
	updated_at: Date | null;
	created_by: Id | string | null;
	updated_by: Id | string | null;
	last_login_date: Date | null;
}

export interface IUserWithPassword extends IUser {
	password: string;
}

export interface IUpdateUser extends Partial<IUser> {
	id: Id | string;
}

export type CreateUserDTO = {
	username: string;
	email: string;
	phone_number: string;
	role: UserRole;
	is_disabled: boolean;
	avatar?: File | Blob | null;
};

export type UpdateUserDTO = Partial<CreateUserDTO> & {
	id: Id | string;
}