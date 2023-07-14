import { UserRoleWithOwner } from '@/types/user.type';

export type Permission = Record<UserRoleWithOwner, boolean>;
export type Actions = Record<string, Permission>;

export type UsersActions = Record<'GET_USERS' | 'GET_ONE_USER' | 'UPDATE_USERS' | 'DELETE_USERS' | 'CREATE_USERS', Permission>;

export const USERS_ACTIONS: UsersActions = {
	GET_USERS: {
		owner: true,
		admin: true,
		user: false,
	},
	GET_ONE_USER: {
		owner: true,
		admin: true,
		user: false,
	},
	UPDATE_USERS: {
		owner: true,
		admin: true,
		user: false,
	},
	DELETE_USERS: {
		owner: true,
		admin: true,
		user: false,
	},
	CREATE_USERS: {
		owner: true,
		admin: true,
		user: false,
	},
};

export type SettingsActions = Record<'GET_SETTINGS' | 'UPDATE_SETTINGS' | 'CHANGE_OWNER', Permission>;

export const SETTINGS_ACTIONS: SettingsActions = {
	GET_SETTINGS: {
		owner: true,
		admin: false,
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