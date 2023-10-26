import { UserPopulated } from '@/schemas/user';

import { UsersState } from './users.reducer';

export const USERS_SET_STATE_ACTION = 'users/setState';
export const USERS_UPDATE_ACTION = 'users/update';
export const USERS_PENDING_ACTION = 'users/pending';
export const USERS_ERROR_ACTION = 'users/error';
export const USERS_IDLE_ACTION = 'users/idle';

export type SetUsersStatePayload = Partial<Omit<UsersState, 'loading' | 'error'>>; 
type SetUsersStateAction = {
	type: typeof USERS_SET_STATE_ACTION;
	payload: SetUsersStatePayload;
}

export type UpdateUsersPayload = (Partial<UserPopulated> & { id: string })[];
type UpdateUsersAction = {
	type: typeof USERS_UPDATE_ACTION;
	payload: UpdateUsersPayload;
}

type PendingUsersAction = {
	type: typeof USERS_PENDING_ACTION;
}

export type ErrorUsersPayload = string;
type ErrorUsersAction = {
	type: typeof USERS_ERROR_ACTION;
	payload: ErrorUsersPayload;
}

type IdleUsersAction = {
	type: typeof USERS_IDLE_ACTION;
}

export type UsersReducerAction = SetUsersStateAction | UpdateUsersAction | PendingUsersAction | ErrorUsersAction | IdleUsersAction;