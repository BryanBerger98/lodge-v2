export const UserRoles = [ 'admin', 'user' ] as const;
export type UserRole = typeof UserRoles[number];
export const UserRolesWithOwner = [ 'owner', 'admin', 'user' ] as const;
export type UserRoleWithOwner = typeof UserRolesWithOwner[number];

export const AuthProviders = [ 'email', 'google', 'facebook', 'github', 'microsoft', 'apple' ] as const;
export type AuthProvider = typeof AuthProviders[number];

export interface IUser {
	id: string;
	email: string;
	has_email_verified: boolean;
	role: UserRoleWithOwner;
	username: string;
	phone_number: string;
	photo_url: string | null;
	photo_key: string | null;
	is_disabled: boolean;
	provider_data: AuthProvider;
	created_at: Date;
	updated_at: Date | null;
	created_by: string | null;
	updated_by: string | null;
	last_login_date: Date | null;
	has_password: boolean;
}

export interface IUserWithPassword extends IUser {
	password: string;
}

export interface IUpdateUser extends Partial<IUser> {
	id: string;
}

export interface IUserPopulated extends Omit<IUser, 'created_by' | 'updated_by'> {
	created_by: IUser;
	updated_by: IUser;
}