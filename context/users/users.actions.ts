import { IUserPopulated } from '@/schemas/user/populated.schema';

import { UsersState } from './users.reducer';

export enum USERS_ACTION {
	SET_STATE = 'users/setState',
	UPDATE = 'users/update',
	PENDING = 'users/pending',
	ERROR = 'users/error',
	IDLE = 'users/idle',
};

export type SetUsersStatePayload = Partial<Omit<UsersState, 'loading' | 'error'>>; 
type SetUsersStateAction = {
	type: USERS_ACTION.SET_STATE;
	payload: SetUsersStatePayload;
}

export type UpdateUsersPayload = (Partial<IUserPopulated> & { id: string })[];
type UpdateUsersAction = {
	type: USERS_ACTION.UPDATE;
	payload: UpdateUsersPayload;
}

type PendingUsersAction = {
	type: USERS_ACTION.PENDING;
}

export type ErrorUsersPayload = string;
type ErrorUsersAction = {
	type: USERS_ACTION.ERROR;
	payload: ErrorUsersPayload;
}

type IdleUsersAction = {
	type: USERS_ACTION.IDLE;
}

export type UsersReducerAction = SetUsersStateAction | UpdateUsersAction | PendingUsersAction | ErrorUsersAction | IdleUsersAction;