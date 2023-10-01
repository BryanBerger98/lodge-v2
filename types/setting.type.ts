import { SettingName } from '@/utils/settings';

import { IFile } from './file.type';
import { IUser } from './user.type';
import { Optional } from './utils';

export const SettingTypes = [ 'boolean', 'string', 'number', 'object_id', 'date', 'image' ] as const;
export type SettingType = typeof SettingTypes[number];

export interface ISettingBase {
	id: string;
	name: SettingName;
	value: any;
	data_type: SettingType;
	created_at: Date;
	updated_at: Date | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface ISettingImage extends ISettingBase {
	value: string | null;
	data_type: 'image';
}

export interface ISettingBoolean extends ISettingBase {
	value: boolean;
	data_type: 'boolean';
}

export interface ISettingString extends ISettingBase {
	value: string;
	data_type: 'string';
}

export interface ISettingNumber extends ISettingBase {
	value: number;
	data_type: 'number';
}

export interface ISettingObjectId extends ISettingBase {
	value: string | null;
	data_type: 'object_id';
}

export interface ISettingDate extends ISettingBase {
	value: Date;
	data_type: 'date';
}

// export type ISetting = ISettingBoolean | ISettingString | ISettingNumber | ISettingObjectId | ISettingDate | ISettingImage;
export type ISetting<T = SettingType> =
	T extends 'boolean' ? ISettingBoolean
	: T extends 'string' ? ISettingString
	: T extends 'number' ? ISettingNumber
	: T extends 'object_id' ? ISettingObjectId
	: T extends 'date' ? ISettingDate
	: T extends 'image' ? ISettingImage
	: never;

export interface ISettingImagePopulated extends Omit<ISettingImage, 'value'> {
	value: IFile | null;
}

export type ISettingPopulated = Omit<ISettingBoolean | ISettingString | ISettingNumber | ISettingObjectId | ISettingDate | ISettingImagePopulated, 'created_by' | 'updated_by'> & {
	created_by: IUser | null;
	updated_by: IUser | null;
};

// export type IUpdateSetting<T = SettingType> = Partial<ISetting<T>> & {
// 	name: SettingKey;
// }

export type IUpdateSetting<T = SettingType> =
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

export type UnregisteredSetting<T = SettingType> =
	T extends 'boolean' ? Optional<ISettingBoolean, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: T extends 'string' ? Optional<ISettingString, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: T extends 'number' ? Optional<ISettingNumber, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: T extends 'object_id' ? Optional<ISettingObjectId, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: T extends 'date' ? Optional<ISettingDate, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: T extends 'image' ? Optional<ISettingImage, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
	: never;