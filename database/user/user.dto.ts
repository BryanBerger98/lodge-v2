import { AuthProvider, UserRoleWithOwner } from '@/types/user.type';

export type CreateUserDTO = {
	email: string;
	password: string;
} | {
	username: string;
	email: string;
	phone_number: string;
	role: UserRoleWithOwner;
	is_disabled: boolean;
	provider_data: AuthProvider;
	created_by: string | null;
	photo: string | null;
	has_password: boolean;
};

export type UpdateUserDTO = {
	id: string;
	username?: string;
	email?: string;
	phone_number?: string;
	role?: UserRoleWithOwner;
	is_disabled?: boolean;
	updated_by: string | null;
	has_email_verified?: boolean;
	photo?: string | null;
	last_login_date?: Date | null;
};
