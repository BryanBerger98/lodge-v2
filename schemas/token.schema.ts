import { z } from 'zod';

export enum TokenAction {
	RESET_PASSWORD = 'reset_password',
	EMAIL_VERIFICATION = 'email_verification',
	NEW_EMAIL_CONFIRMATION = 'new_email_confirmation',
};

export const TokenSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.'),
	target_id: z.string().min(1, 'Cannot be empty.'),
	token: z.string().min(1, 'Cannot be empty.'),
	expiration_date: z.coerce.date(),
	action: z.nativeEnum(TokenAction),
	created_at: z.coerce.date(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable(),
});
export type Token = z.infer<typeof TokenSchema>;

export const SafeTokenSchema = TokenSchema.omit({ token: true });
export type SafeToken = z.infer<typeof SafeTokenSchema>;