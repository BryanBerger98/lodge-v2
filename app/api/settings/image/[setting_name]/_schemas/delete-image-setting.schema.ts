import { z } from 'zod';

import { SettingName } from '@/schemas/setting';

export const DeleteImageSettingSchema = z.object({
	name: z.nativeEnum({
		[ SettingName.BRAND_LOGO ]: SettingName.BRAND_LOGO,
		[ SettingName.BRAND_FAVICON ]: SettingName.BRAND_FAVICON,
	}), 
});