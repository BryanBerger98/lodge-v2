import { z } from 'zod';

import { SettingName } from '@/schemas/setting';

export const UpdateImageSettingSchema = z.object({
	name: z.nativeEnum({
		[ SettingName.BRAND_LOGO ]: SettingName.BRAND_LOGO,
		[ SettingName.BRAND_FAVICON ]: SettingName.BRAND_FAVICON,
	}),
	value: z.union([ z.instanceof(File), z.instanceof(Blob), z.null() ]),
});