export type TokenAction = 'reset_password' | 'email_verification';

export interface IToken {
	id: string;
	target_id: string;
	token: string;
	expiration_date: Date;
	action: TokenAction;
	created_at: Date;
	created_by: string | null;
}

export type SafeTokenData = Omit<IToken, 'token'>;