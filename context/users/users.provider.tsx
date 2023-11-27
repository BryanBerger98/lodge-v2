'use client';

import { ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';

import useFetchUsers from '@/hooks/users/useFetchUsers';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { LoadingState, LoadingStateError } from '@/types/utils/loading.type';

import { SetUsersStatePayload, USERS_ACTION } from './users.actions';
import usersReducer, { UsersState } from './users.reducer';

import UsersContext from '.';

const INITIAL_STATE: UsersState = {
	users: [],
	total: 0,
	loading: 'idle',
};

type UsersProviderProps = {
	children: ReactNode;
	users?: IUserPopulated[],
	total?: number,
}

const UsersProvider = ({ users: initialUsersState = [], total = 0, children }: UsersProviderProps) => {

	const [ state, dispatch ] = useReducer(usersReducer, {
		...INITIAL_STATE,
		total,
		users: initialUsersState, 
	});

	const { refetch, routeParams, data, isLoading, error } = useFetchUsers();

	const updateUsers = useCallback((...usersToUpdate: (Partial<IUserPopulated> & { id: string })[]) => {
		dispatch({
			type: USERS_ACTION.UPDATE,
			payload: usersToUpdate,
		});
	}, []);

	const setUsersState = useCallback((newState: SetUsersStatePayload) => {
		dispatch({
			type: USERS_ACTION.SET_STATE,
			payload: newState,
		});
	}, []);

	const setLoadingState = useCallback(<T extends LoadingState>(loading: T, ...error: LoadingStateError<T>) => {
		switch (loading) {
			case 'pending':
				dispatch({ type: USERS_ACTION.PENDING });
				break;
			case 'error':
				dispatch({
					type: USERS_ACTION.ERROR,
					payload: error[ 0 ] as string,
				});
				break;
			default:
				dispatch({ type: USERS_ACTION.IDLE });
				break;
		}
	}, []);

	useEffect(() => {
		if (isLoading) {
			setLoadingState('pending');
		}
		if (error) {
			console.error(error);
			setLoadingState('error', error.message);
		}
		if (data) {
			setUsersState({
				users: data.users,
				total: data.total,
			});
			setLoadingState('idle');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isLoading, error, data ]);

	const contextValues = useMemo(() => ({
		...state,
		setUsersState,
		updateUsers,
		setLoadingState,
		refetchUsers: refetch,
		routeParams,
	}), [
		state,
		setUsersState,
		updateUsers,
		setLoadingState,
		refetch,
		routeParams,
	]);

	return(
		<UsersContext.Provider value={ contextValues }>
			{ children }
		</UsersContext.Provider>
	);

};

export default UsersProvider;