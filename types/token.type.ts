import { Id } from '@/config/database.config';

export interface IToken {
	id: Id | string;
	token: string;
	expiration_date: Date;
	action: 'reset_password' | 'email_verification';
	created_at: Date;
	created_by: Id | string | null;
}