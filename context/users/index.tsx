'use client';

import { createContext, ReactNode, useCallback, useMemo, useReducer } from 'react';

import { LoadingStateError, LoadingState } from '@/types/loading.type';
import { IUpdateUser, IUser } from '@/types/user.type';

import { SetUsersStatePayload, USERS_ERROR_ACTION, USERS_IDLE_ACTION, USERS_PENDING_ACTION, USERS_SET_STATE_ACTION, USERS_UPDATE_ACTION } from './users.actions';
import usersReducer, { UsersState } from './users.reducer';

type UsersContextValues = UsersState & {
	setUsersState: (newState: SetUsersStatePayload) => void;
	updateUsers: (...userToUpdate: IUpdateUser[]) => void;
	setLoadingState: <T extends LoadingState, E extends LoadingStateError<T>>(loading: T, ...error: E) => void;
}

const UsersContext = createContext<UsersContextValues | null>(null);
export { UsersContext };

const INITIAL_STATE: UsersState = {
	users: [],
	total: 0,
	loading: 'idle',
};


type UsersProviderProps = {
	children: ReactNode;
	users?: IUser[],
	total?: number,
}

const UsersProvider = ({ users: initialUsersState = [], total = 0, children }: UsersProviderProps) => {

	const [ state, dispatch ] = useReducer(usersReducer, {
		...INITIAL_STATE,
		total,
		users: initialUsersState, 
	});

	const updateUsers = useCallback((...usersToUpdate: IUpdateUser[]) => {
		dispatch({
			type: USERS_UPDATE_ACTION,
			payload: usersToUpdate,
		});
	}, []);

	const setUsersState = useCallback((newState: SetUsersStatePayload) => {
		dispatch({
			type: USERS_SET_STATE_ACTION,
			payload: newState,
		});
	}, []);

	const setLoadingState = useCallback(<T extends LoadingState>(loading: T, ...error: LoadingStateError<T>) => {
		switch (loading) {
			case 'pending':
				dispatch({ type: USERS_PENDING_ACTION });
				break;
			case 'error':
				dispatch({
					type: USERS_ERROR_ACTION,
					payload: error[ 0 ] as string,
				});
				break;
			default:
				dispatch({ type: USERS_IDLE_ACTION });
				break;
		}
	}, []);

	const contextValues = useMemo(() => ({
		...state,
		setUsersState,
		updateUsers,
		setLoadingState,
	}), [
		state,
		setUsersState,
		updateUsers,
		setLoadingState,
	]);

	return(
		<UsersContext.Provider value={ contextValues }>
			{ children }
		</UsersContext.Provider>
	);

};

export default UsersProvider;