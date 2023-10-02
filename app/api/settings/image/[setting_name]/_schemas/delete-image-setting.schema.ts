import { z } from 'zod';

import { SettingImageNamesTuple } from '@/utils/settings';

export const DeleteImageSettingSchema = z.object({ name: z.enum(SettingImageNamesTuple) });