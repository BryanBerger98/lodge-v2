import { z } from 'zod';

export const FetchSettingsSchema = z.object({ name: z.coerce.string().optional().transform(value => value ? value.split(',') : []) });