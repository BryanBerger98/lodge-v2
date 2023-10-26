import { TokenAction } from '@/schemas/token.schema';

export type CreateTokenDTO = {
	token: string;
	expiration_date: Date;
	action: TokenAction;
	created_by: string | null;
	target_id: string;
};