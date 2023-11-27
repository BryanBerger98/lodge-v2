import { Reducer } from 'react';

import { IUserPopulated } from '@/schemas/user/populated.schema';
import { LoadingState } from '@/types/utils/loading.type';

import { USERS_ACTION, UsersReducerAction } from './users.actions';

export type UsersState = {
	users: IUserPopulated[];
	total: number;
	loading: LoadingState;
	error?: string;
}

const usersReducer: Reducer<UsersState, UsersReducerAction> = (state, action) => {
	switch (action.type) {
		case USERS_ACTION.SET_STATE:
			return {
				...state,
				...action.payload, 
			};
		case USERS_ACTION.IDLE:
			return {
				...state,
				loading: 'idle',
			};
		case USERS_ACTION.PENDING:
			return {
				...state,
				loading: 'pending',
			};
		case USERS_ACTION.ERROR:
			return {
				...state,
				loading: 'error',
				error: action.payload,
			};
		case USERS_ACTION.UPDATE:
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