import { z } from 'zod';

import { UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingBooleanSchema, UnregisteredSettingDatePopulatedSchema, UnregisteredSettingDateSchema, UnregisteredSettingImagePopulatedSchema, UnregisteredSettingImageSchema, UnregisteredSettingNumberSchema, UnregisteredSettingObjectIdPopulatedSchema, UnregisteredSettingObjectIdSchema, UnregisteredSettingStringPopulatedSchema, UnregisteredSettingStringSchema } from './unregistered-setting.schema';

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
export type Setting = z.infer<typeof SettingSchema>;

export const SettingPopulatedImageSchema = UnregisteredSettingImagePopulatedSchema.required();
export type SettingPopulatedImage = z.infer<typeof SettingPopulatedImageSchema>;
export const SettingPopulatedBooleanSchema = UnregisteredSettingBooleanPopulatedSchema.required();
export type SettingPopulatedBoolean = z.infer<typeof SettingPopulatedBooleanSchema>;
export const SettingPopulatedStringSchema = UnregisteredSettingStringPopulatedSchema.required();
export type SettingPopulatedString = z.infer<typeof SettingPopulatedStringSchema>;
export const SettingPopulatedNumberSchema = UnregisteredSettingStringPopulatedSchema.required();
export type SettingPopulatedNumber = z.infer<typeof SettingPopulatedNumberSchema>;
export const SettingPopulatedObjectIdSchema = UnregisteredSettingObjectIdPopulatedSchema.required();
export type SettingPopulatedObjectId = z.infer<typeof SettingPopulatedObjectIdSchema>;
export const SettingPopulatedDateSchema = UnregisteredSettingDatePopulatedSchema.required();
export type SettingPopulatedDate = z.infer<typeof SettingPopulatedDateSchema>;
