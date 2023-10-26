import { z } from 'zod';

import { SettingDataType } from './data-type.schema';
import { UnregisteredSettingBaseSchema, UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingBooleanSchema, UnregisteredSettingDatePopulatedSchema, UnregisteredSettingDateSchema, UnregisteredSettingImagePopulatedSchema, UnregisteredSettingImageSchema, UnregisteredSettingNumberPopulatedSchema, UnregisteredSettingNumberSchema, UnregisteredSettingObjectIdPopulatedSchema, UnregisteredSettingObjectIdSchema, UnregisteredSettingStringPopulatedSchema, UnregisteredSettingStringSchema } from './unregistered-setting.schema';

export const SettingBaseSchema = UnregisteredSettingBaseSchema.required();
export type SettingBase = z.infer<typeof SettingBaseSchema>;
export const SettingImageSchema = UnregisteredSettingImageSchema.required();
export type SettingImage = z.infer<typeof SettingImageSchema>;
export const SettingBooleanSchema = UnregisteredSettingBooleanSchema.required();
export type SettingBoolean = z.infer<typeof SettingBooleanSchema>;
export const SettingStringSchema = UnregisteredSettingStringSchema.required();
export type SettingString = z.infer<typeof SettingStringSchema>;
export const SettingNumberSchema = UnregisteredSettingNumberSchema.required();
export type SettingNumber = z.infer<typeof SettingNumberSchema>;
export const SettingObjectIdSchema = UnregisteredSettingObjectIdSchema.required();
export type SettingObjectId = z.infer<typeof SettingObjectIdSchema>;
export const SettingDateSchema = UnregisteredSettingDateSchema.required();
export type SettingDate = z.infer<typeof SettingDateSchema>;

export const SettingSchema = z.discriminatedUnion('data_type', [
	SettingImageSchema,
	SettingBooleanSchema,
	SettingStringSchema,
	SettingNumberSchema,
	SettingObjectIdSchema,
	SettingDateSchema,
]);

export type Setting<T = SettingDataType> = 
	T extends SettingDataType.BOOLEAN ? SettingBoolean
	: T extends SettingDataType.STRING ? SettingString
	: T extends SettingDataType.NUMBER ? SettingNumber
	: T extends SettingDataType.OBJECT_ID ? SettingObjectId
	: T extends SettingDataType.DATE ? SettingDate
	: T extends SettingDataType.IMAGE ? SettingImage
	: z.infer<typeof SettingSchema>;

export const SettingPopulatedImageSchema = UnregisteredSettingImagePopulatedSchema.required();
export type SettingPopulatedImage = z.infer<typeof SettingPopulatedImageSchema>;
export const SettingPopulatedBooleanSchema = UnregisteredSettingBooleanPopulatedSchema.required();
export type SettingPopulatedBoolean = z.infer<typeof SettingPopulatedBooleanSchema>;
export const SettingPopulatedStringSchema = UnregisteredSettingStringPopulatedSchema.required();
export type SettingPopulatedString = z.infer<typeof SettingPopulatedStringSchema>;
export const SettingPopulatedNumberSchema = UnregisteredSettingNumberPopulatedSchema.required();
export type SettingPopulatedNumber = z.infer<typeof SettingPopulatedNumberSchema>;
export const SettingPopulatedObjectIdSchema = UnregisteredSettingObjectIdPopulatedSchema.required();
export type SettingPopulatedObjectId = z.infer<typeof SettingPopulatedObjectIdSchema>;
export const SettingPopulatedDateSchema = UnregisteredSettingDatePopulatedSchema.required();
export type SettingPopulatedDate = z.infer<typeof SettingPopulatedDateSchema>;

export const SettingPopulatedSchema = z.discriminatedUnion('data_type', [
	SettingPopulatedImageSchema,
	SettingPopulatedBooleanSchema,
	SettingPopulatedStringSchema,
	SettingPopulatedNumberSchema,
	SettingPopulatedObjectIdSchema,
	SettingPopulatedDateSchema,
]);

export type SettingPopulated<T = SettingDataType> = 
	T extends SettingDataType.BOOLEAN ? SettingPopulatedBoolean
	: T extends SettingDataType.STRING ? SettingPopulatedString
	: T extends SettingDataType.NUMBER ? SettingPopulatedNumber
	: T extends SettingDataType.OBJECT_ID ? SettingPopulatedObjectId
	: T extends SettingDataType.DATE ? SettingPopulatedDate
	: T extends SettingDataType.IMAGE ? SettingPopulatedImage
	: z.infer<typeof SettingPopulatedSchema>;

export * from './data-type.schema';
export * from './name.shema';
export * from './unregistered-setting.schema';