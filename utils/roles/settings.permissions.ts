import { Permission } from '.';

export type SettingsActions = Record<'GET_SETTINGS' | 'UPDATE_SETTINGS' | 'CHANGE_OWNER', Permission>;

export const SETTINGS_ACTIONS: SettingsActions = {
	GET_SETTINGS: {
		owner: true,
		admin: true,
		user: false,
	},
	UPDATE_SETTINGS: {
		owner: true,
		admin: false,
		user: false,
	},
	CHANGE_OWNER: {
		owner: true,
		admin: false,
		user: false,
	},
};