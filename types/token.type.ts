import { Id } from '@/lib/database';

export type TokenAction = 'reset_password' | 'email_verification';

export interface IToken {
	id: Id | string;
	target_id: Id | string;
	token: string;
	expiration_date: Date;
	action: TokenAction;
	created_at: Date;
	created_by: Id | string | null;
}

export type SafeTokenData = Omit<IToken, 'token'>;