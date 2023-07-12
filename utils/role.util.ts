import { UserRole } from '@/types/user.type';

export type Permission = Record<UserRole, boolean>;
export type Actions = Record<string, Permission>;

export type UsersActions = Record<'GET_USERS' | 'GET_ONE_USER' | 'UPDATE_USERS' | 'DELETE_USERS' | 'CREATE_USERS', Permission>;

export const USERS_ACTIONS: UsersActions = {
	GET_USERS: {
		admin: true,
		user: false,
	},
	GET_ONE_USER: {
		admin: true,
		user: false,
	},
	UPDATE_USERS: {
		admin: true,
		user: false,
	},
	DELETE_USERS: {
		admin: true,
		user: false,
	},
	CREATE_USERS: {
		admin: true,
		user: false,
	},
};