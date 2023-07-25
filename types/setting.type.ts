import { Id } from '@/config/database.config';

import { Optional } from './utils.type';

export const SettingTypes = [ 'boolean', 'string', 'number', 'objectId', 'date' ] as const;
export type SettingType = typeof SettingTypes[number];

export interface ISetting {
	id: Id | string;
	name: string;
	value: any;
	data_type: SettingType;
	created_at: Date;
	updated_at: Date | null;
	created_by: Id | string | null;
	updated_by: Id | string | null;
}

export interface IUpdateSetting extends Partial<ISetting> {
	name: string;
}

export type UnregisteredSetting = Optional<ISetting, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;