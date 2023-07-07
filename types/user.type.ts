import { Id } from '@/config/database.config';

export type UserRole = 'admin' | 'user';

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
	provider_data: 'email';
	created_at: Date;
	updated_at: Date | null;
	created_by: Id | string | null;
	updated_by: Id | string | null;
	last_login_date: Date | null;
}

export interface IUserWithPassword extends IUser {
	password: string;
}