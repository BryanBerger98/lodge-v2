import { z } from 'zod';

import { FileSchema } from '../file';
import { UserSchema } from '../user';

import { SettingDataType, SettingDataTypeSchema } from './data-type.schema';

export const UnregisteredSettingBaseSchema = z.object({
	id: z.string().min(1, 'Cannot be empty.').optional(),
	name: z.string().min(1, 'Cannot be empty.'),
	value: z.any(),
	data_type: SettingDataTypeSchema,
	created_at: z.date().nullable().optional(),
	updated_at: z.date().nullable().optional(),
	created_by: z.string().min(1, 'Cannot be empty.').nullable().optional(),
	updated_by: z.string().min(1, 'Cannot be empty.').nullable().optional(),
});

export const UnregisteredSettingImageSchema = UnregisteredSettingBaseSchema.extend({
	value: z.string().nullable(),
	data_type: z.literal(SettingDataType.IMAGE),
});
export type UnregisteredSettingImage = z.infer<typeof UnregisteredSettingImageSchema>;

export const UnregisteredSettingBooleanSchema = UnregisteredSettingBaseSchema.extend({
	value: z.boolean(),
	data_type: z.literal(SettingDataType.BOOLEAN),
});
export type UnregisteredSettingBoolean = z.infer<typeof UnregisteredSettingBooleanSchema>;

export const UnregisteredSettingStringSchema = UnregisteredSettingBaseSchema.extend({
	value: z.string(),
	data_type: z.literal(SettingDataType.STRING),
});
export type UnregisteredSettingString = z.infer<typeof UnregisteredSettingStringSchema>;

export const UnregisteredSettingNumberSchema = UnregisteredSettingBaseSchema.extend({
	value: z.number(),
	data_type: z.literal(SettingDataType.NUMBER),
});
export type UnregisteredSettingNumber = z.infer<typeof UnregisteredSettingNumberSchema>;

export const UnregisteredSettingObjectIdSchema = UnregisteredSettingBaseSchema.extend({
	value: z.string().nullable(),
	data_type: z.literal(SettingDataType.OBJECT_ID),
});
export type UnregisteredSettingObjectId = z.infer<typeof UnregisteredSettingObjectIdSchema>;

export const UnregisteredSettingDateSchema = UnregisteredSettingBaseSchema.extend({
	value: z.date(),
	data_type: z.literal(SettingDataType.DATE),
});
export type UnregisteredSettingDate = z.infer<typeof UnregisteredSettingDateSchema>;

export const UnregisteredSettingSchema = z.discriminatedUnion('data_type', [
	UnregisteredSettingImageSchema,
	UnregisteredSettingBooleanSchema,
	UnregisteredSettingStringSchema,
	UnregisteredSettingNumberSchema,
	UnregisteredSettingObjectIdSchema,
	UnregisteredSettingDateSchema,
]);

export type UnregisteredSetting<T = SettingDataType> = 
	T extends SettingDataType.BOOLEAN ? UnregisteredSettingBoolean
	: T extends SettingDataType.STRING ? UnregisteredSettingString
	: T extends SettingDataType.NUMBER ? UnregisteredSettingNumber
	: T extends SettingDataType.OBJECT_ID ? UnregisteredSettingObjectId
	: T extends SettingDataType.DATE ? UnregisteredSettingDate
	: T extends SettingDataType.IMAGE ? UnregisteredSettingImage
	: z.infer<typeof UnregisteredSettingSchema>;

export const UnregisteredSettingBasePopulatedSchema = UnregisteredSettingBaseSchema.extend({
	created_by: UserSchema.nullable().optional(),
	updated_by: UserSchema.nullable().optional(),
});

export const UnregisteredSettingImagePopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: FileSchema.or(z.object({ url: z.string().min(1, 'Cannot be empty') })).nullable(),
	data_type: z.literal(SettingDataType.IMAGE),
});
export type UnregisteredSettingImagePopulated = z.infer<typeof UnregisteredSettingImagePopulatedSchema>;

export const UnregisteredSettingBooleanPopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: z.boolean(),
	data_type: z.literal(SettingDataType.BOOLEAN),
});
export type UnregisteredSettingBooleanPopulated = z.infer<typeof UnregisteredSettingBooleanPopulatedSchema>;

export const UnregisteredSettingStringPopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: z.string(),
	data_type: z.literal(SettingDataType.STRING),
});
export type UnregisteredSettingStringPopulated = z.infer<typeof UnregisteredSettingStringPopulatedSchema>;

export const UnregisteredSettingNumberPopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: z.number(),
	data_type: z.literal(SettingDataType.NUMBER),
});
export type UnregisteredSettingNumberPopulated = z.infer<typeof UnregisteredSettingNumberPopulatedSchema>;

export const UnregisteredSettingObjectIdPopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: z.string().nullable(),
	data_type: z.literal(SettingDataType.OBJECT_ID),
});
export type UnregisteredSettingObjectIdPopulated = z.infer<typeof UnregisteredSettingObjectIdPopulatedSchema>;

export const UnregisteredSettingDatePopulatedSchema = UnregisteredSettingBasePopulatedSchema.extend({
	value: z.date(),
	data_type: z.literal(SettingDataType.DATE),
});
export type UnregisteredSettingDatePopulated = z.infer<typeof UnregisteredSettingDatePopulatedSchema>;

export const UnregisteredSettingPopulatedSchema = z.discriminatedUnion('data_type', [
	UnregisteredSettingImagePopulatedSchema,
	UnregisteredSettingBooleanPopulatedSchema,
	UnregisteredSettingStringPopulatedSchema,
	UnregisteredSettingNumberPopulatedSchema,
	UnregisteredSettingObjectIdPopulatedSchema,
	UnregisteredSettingDatePopulatedSchema,
]);

export type UnregisteredSettingPopulated<T = SettingDataType> = 
	T extends SettingDataType.BOOLEAN ? UnregisteredSettingBooleanPopulated
	: T extends SettingDataType.STRING ? UnregisteredSettingStringPopulated
	: T extends SettingDataType.NUMBER ? UnregisteredSettingNumberPopulated
	: T extends SettingDataType.OBJECT_ID ? UnregisteredSettingObjectIdPopulated
	: T extends SettingDataType.DATE ? UnregisteredSettingDatePopulated
	: T extends SettingDataType.IMAGE ? UnregisteredSettingImagePopulated
	: z.infer<typeof UnregisteredSettingPopulatedSchema>;

export type UpdateUnregisteredSettingPopulated<T = SettingDataType> =
	T extends SettingDataType.BOOLEAN ? UnregisteredSettingBooleanPopulated
	: T extends SettingDataType.STRING ? UnregisteredSettingStringPopulated
	: T extends SettingDataType.NUMBER ? UnregisteredSettingNumberPopulated
	: T extends SettingDataType.OBJECT_ID ? UnregisteredSettingObjectIdPopulated
	: T extends SettingDataType.DATE ? UnregisteredSettingDatePopulated
	: T extends SettingDataType.IMAGE ? UnregisteredSettingImagePopulated
	: z.infer<typeof UnregisteredSettingPopulatedSchema>;