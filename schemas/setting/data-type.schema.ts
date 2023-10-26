import { z } from 'zod';

export enum SettingDataType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
	OBJECT_ID = 'object_id',
	IMAGE = 'image',
};

export const SettingDataTypeSchema = z.nativeEnum(SettingDataType);