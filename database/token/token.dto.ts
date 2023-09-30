export type CreateTokenDTO = {
	token: string;
	expiration_date: Date;
	action: 'reset_password' | 'email_verification';
	created_by: string | null;
	target_id: string;
};