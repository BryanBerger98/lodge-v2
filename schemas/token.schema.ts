import { z } from 'zod';

export enum TokenAction {
	RESET_PASSWORD = 'reset_password',
	EMAIL_VERIFICATION = 'email_verification',
};

export const TokenSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	target_id: z.string().min(1, 'Cannot be empty.'),
	token: z.string().min(1, 'Cannot be empty.'),
	expiration_date: z.date(),
	action: z.nativeEnum(TokenAction),
	created_at: z.date(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable(),
});
export type Token = z.infer<typeof TokenSchema>;