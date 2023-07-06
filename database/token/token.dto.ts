import { Id } from '@/config/database.config';

export type CreateTokenDTO = {
	token: string;
	expiration_date: Date;
	action: 'reset_password' | 'email_verification';
	created_by: Id | string | null;
};