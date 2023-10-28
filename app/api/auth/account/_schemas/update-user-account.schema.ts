import { z } from 'zod';

import { Gender } from '@/schemas/user/gender.schema';

export const UpdateUserAccountSchema = z.object({
	username: z.coerce.string(),
	phone_number: z.coerce.string(),
	first_name: z.coerce.string(),
	last_name: z.coerce.string(),
	birth_date: z.coerce.date(),
	gender: z.nativeEnum(Gender),
})
	.partial()
	.refine(
		({ username, phone_number, first_name, last_name, birth_date, gender }) =>
			username !== undefined || phone_number !== undefined || first_name !== undefined || last_name !== undefined || birth_date !== undefined || gender !== undefined,
		{ message: 'Nothing to update' }
	);
