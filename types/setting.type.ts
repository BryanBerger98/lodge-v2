import { SettingName } from '@/utils/settings';

import { IFile } from './file.type';
import { IUser } from './user.type';

export const SettingDataTypes = [ 'boolean', 'string', 'number', 'object_id', 'date', 'image' ] as const;
export type SettingDataType = typeof SettingDataTypes[number];

interface IUnregisteredSettingBase {
	id?: string;
	name: SettingName;
	value: any;
	data_type: SettingDataType;
	created_at?: Date | null;
	updated_at?: Date | null;
	created_by?: string | null;
	updated_by?: string | null;
};

// Unregistered settings
export interface IUnregisteredSettingImage extends IUnregisteredSettingBase {
	value: string | null;
	data_type: 'image';
}
export interface IUnregisteredSettingBoolean extends IUnregisteredSettingBase {
	value: boolean;
	data_type: 'boolean';
}
export interface IUnregisteredSettingString extends IUnregisteredSettingBase {
	value: string;
	data_type: 'string';
}
export interface IUnregisteredSettingNumber extends IUnregisteredSettingBase {
	value: number;
	data_type: 'number';
}
export interface IUnregisteredSettingObjectId extends IUnregisteredSettingBase {
	value: string | null;
	data_type: 'object_id';
}
export interface IUnregisteredSettingDate extends IUnregisteredSettingBase {
	value: Date;
	data_type: 'date';
}

// Unregistered settings populated
export interface IUnregisteredSettingBasePopulated extends Omit<IUnregisteredSettingBase, 'created_by' | 'updated_by'> {
	created_by?: IUser | null;
	updated_by?: IUser | null;
};
export interface IUnregisteredSettingImagePopulated extends IUnregisteredSettingBasePopulated {
	value: Partial<IFile> & { url: string } | null;
	data_type: 'image';
}
export interface IUnregisteredSettingBooleanPopulated extends IUnregisteredSettingBasePopulated {
	value: boolean;
	data_type: 'boolean';
}
export interface IUnregisteredSettingStringPopulated extends IUnregisteredSettingBasePopulated {
	value: string;
	data_type: 'string';
}
export interface IUnregisteredSettingNumberPopulated extends IUnregisteredSettingBasePopulated {
	value: number;
	data_type: 'number';
}
export interface IUnregisteredSettingObjectIdPopulated extends IUnregisteredSettingBasePopulated {
	value: string | null;
	data_type: 'object_id';
}
export interface IUnregisteredSettingDatePopulated extends IUnregisteredSettingBasePopulated {
	value: Date;
	data_type: 'date';
}

// Unregistered setting
export type IUnregisteredSetting<T = SettingDataType> =
	T extends 'boolean' ? IUnregisteredSettingBoolean
	: T extends 'string' ? IUnregisteredSettingString
	: T extends 'number' ? IUnregisteredSettingNumber
	: T extends 'object_id' ? IUnregisteredSettingObjectId
	: T extends 'date' ? IUnregisteredSettingDate
	: T extends 'image' ? IUnregisteredSettingImage
	: never;

// Unregistered settings populated
export type IUnregisteredSettingPopulated<T = SettingDataType> =
	T extends 'boolean' ? IUnregisteredSettingBooleanPopulated
	: T extends 'string' ? IUnregisteredSettingStringPopulated
	: T extends 'number' ? IUnregisteredSettingNumberPopulated
	: T extends 'object_id' ? IUnregisteredSettingObjectIdPopulated
	: T extends 'date' ? IUnregisteredSettingDatePopulated
	: T extends 'image' ? IUnregisteredSettingImagePopulated
	: never;

export type IUpdateUnregisteredSettingPopulated<T = SettingDataType> =
	T extends 'boolean' ? IUnregisteredSettingBooleanPopulated
	: T extends 'string' ? IUnregisteredSettingStringPopulated
	: T extends 'number' ? IUnregisteredSettingNumberPopulated
	: T extends 'object_id' ? IUnregisteredSettingObjectIdPopulated
	: T extends 'date' ? IUnregisteredSettingDatePopulated
	: T extends 'image' ? IUnregisteredSettingImagePopulated
	: never;


// Registered settings
export interface ISettingBase extends Required<IUnregisteredSettingBase> {};
export interface ISettingImage extends Required<IUnregisteredSettingImage> {};
export interface ISettingBoolean extends Required<IUnregisteredSettingBoolean> {};
export interface ISettingString extends Required<IUnregisteredSettingString> {};
export interface ISettingNumber extends Required<IUnregisteredSettingNumber> {};
export interface ISettingObjectId extends Required<IUnregisteredSettingObjectId> {};
export interface ISettingDate extends Required<IUnregisteredSettingDate> {};

// Registered setting
export type ISetting<T = SettingDataType> =
	T extends 'boolean' ? ISettingBoolean
	: T extends 'string' ? ISettingString
	: T extends 'number' ? ISettingNumber
	: T extends 'object_id' ? ISettingObjectId
	: T extends 'date' ? ISettingDate
	: T extends 'image' ? ISettingImage
	: never;

// Registered settings populated
export interface ISettingImagePopulated extends Required<IUnregisteredSettingImagePopulated> {
	value: IFile;
};
export interface ISettingBooleanPopulated extends Required<IUnregisteredSettingBooleanPopulated> {};
export interface ISettingStringPopulated extends Required<IUnregisteredSettingStringPopulated> {};
export interface ISettingNumberPopulated extends Required<IUnregisteredSettingNumberPopulated> {};
export interface ISettingObjectIdPopulated extends Required<IUnregisteredSettingObjectIdPopulated> {};
export interface ISettingDatePopulated extends Required<IUnregisteredSettingDatePopulated> {};

export type ISettingPopulated<T = SettingDataType> =
	T extends 'boolean' ? ISettingBooleanPopulated
	: T extends 'string' ? ISettingStringPopulated
	: T extends 'number' ? ISettingNumberPopulated
	: T extends 'object_id' ? ISettingObjectIdPopulated
	: T extends 'date' ? ISettingDatePopulated
	: T extends 'image' ? ISettingImagePopulated
	: never;

export type IUpdateSetting<T = SettingDataType> =
	T extends 'boolean' ? ISettingBoolean
	: T extends 'string' ? ISettingString
	: T extends 'number' ? ISettingNumber
	: T extends 'object_id' ? ISettingObjectId
	: T extends 'date' ? ISettingDate
	: T extends 'image' ? ISettingImage
	: never;

// export type UnregisteredSetting =
// 	Optional<ISettingBoolean, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
// 	| Optional<ISettingString, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
// 	| Optional<ISettingNumber, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
// 	| Optional<ISettingObjectId, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
// 	| Optional<ISettingDate, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
// 	| Optional<ISettingImage, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>;