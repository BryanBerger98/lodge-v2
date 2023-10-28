import { z } from 'zod';

export const UpdateUserAccountSchema = z.object({
	username: z.string(),
	phone_number: z.string(),
})
	.partial()
	.refine(
		({ username, phone_number }) =>
			username !== undefined || phone_number !== undefined,
		{ message: 'Nothing to update' }
	);
