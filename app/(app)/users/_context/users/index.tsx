'use client';

import { createContext } from 'react';
import { KeyedMutator } from 'swr';

import { FetchUsersResponse } from '@/hooks/users/useFetchUsers';
import { UserPopulated } from '@/schemas/user';
import { LoadingStateError, LoadingState } from '@/types/utils/loading.type';

import { SetUsersStatePayload } from './users.actions';
import { UsersState } from './users.reducer';

type UsersContextValues = UsersState & {
	setUsersState: (newState: SetUsersStatePayload) => void;
	updateUsers: (...userToUpdate: (Partial<UserPopulated> & { id: string })[]) => void;
	setLoadingState: <T extends LoadingState, E extends LoadingStateError<T>>(loading: T, ...error: E) => void;
	refetchUsers: KeyedMutator<FetchUsersResponse>;
	routeParams: {
		sortFields: string | null;
		sortDirections: string | null;
		pageIndex: number;
		pageSize: number;
		search: string | null;
	};
}

const UsersContext = createContext<UsersContextValues | null>(null);
export default UsersContext;