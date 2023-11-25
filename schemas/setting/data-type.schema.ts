import { z } from 'zod';

export enum SettingDataType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
	OBJECT_ID = 'object_id',
	IMAGE = 'image',
	ARRAY_OF_STRINGS = 'array_of_strings',
	ARRAY_OF_OBJECT_IDS = 'array_of_object_ids',
};

export const SettingDataTypeSchema = z.nativeEnum(SettingDataType);