import { z } from 'zod';

import { SettingImageNamesTuple } from '@/utils/settings';

export const UpdateImageSettingSchema = z.object({
	name: z.enum(SettingImageNamesTuple),
	value: z.union([ z.instanceof(File), z.instanceof(Blob), z.null() ]),
});