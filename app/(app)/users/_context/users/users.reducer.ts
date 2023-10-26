import { Reducer } from 'react';

import { UserPopulated } from '@/schemas/user';
import { LoadingState } from '@/types/utils/loading.type';

import { USERS_ERROR_ACTION, USERS_IDLE_ACTION, USERS_PENDING_ACTION, USERS_SET_STATE_ACTION, USERS_UPDATE_ACTION, UsersReducerAction } from './users.actions';

export type UsersState = {
	users: UserPopulated[];
	total: number;
	loading: LoadingState;
	error?: string;
}

const usersReducer: Reducer<UsersState, UsersReducerAction> = (state, action) => {
	switch (action.type) {
		case USERS_SET_STATE_ACTION:
			return {
				...state,
				...action.payload, 
			};
		case USERS_IDLE_ACTION:
			return {
				...state,
				loading: 'idle',
			};
		case USERS_PENDING_ACTION:
			return {
				...state,
				loading: 'pending',
			};
		case USERS_ERROR_ACTION:
			return {
				...state,
				loading: 'error',
				error: action.payload,
			};
		case USERS_UPDATE_ACTION:
			return {
				...state,
				users: state.users.map(user => {
					const userToUpdate = action.payload.find(({ id }) => id === user.id);
					if (userToUpdate) {
						return {
							...user,
							...userToUpdate,
						};
					}
					return user;
				}),
			};
		default:
			return state;
	}
};

export default usersReducer;