import { Id } from '@/config/database.config';

export const SettingTypes = [ 'boolean', 'string', 'number', 'objectId' ] as const;
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