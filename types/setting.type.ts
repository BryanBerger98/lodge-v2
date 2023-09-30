import { IUser } from './user.type';
import { Optional } from './utils';

export const SettingTypes = [ 'boolean', 'string', 'number', 'objectId', 'date' ] as const;
export type SettingType = typeof SettingTypes[number];

export interface ISetting {
	id: string;
	name: string;
	value: any;
	data_type: SettingType;
	created_at: Date;
	updated_at: Date | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface ISettingPopulated extends Omit<ISetting, 'created_by' | 'updated_by'> {
	created_by: IUser | null;
	updated_by: IUser | null;
}

export interface IUpdateSetting extends Partial<ISetting> {
	name: string;
}

export type UnregisteredSetting = Optional<ISetting, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;