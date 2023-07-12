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