'use client';

import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

import { Id } from '@/config/database.config';
import { IUser } from '@/types/user.type';

type UsersContextValues = {
	users: IUser[];
	total: number;
	dispatchUsers: (users: IUser[]) => void;
	updateUser: (userToUpdate: Partial<IUser> & { id: Id | string }) => void;
}

const UsersContext = createContext<UsersContextValues | null>(null);
export { UsersContext };


type UsersProviderProps = {
	children: ReactNode;
	users: IUser[],
}

const UsersProvider = ({ users: initialUsersState, children }: UsersProviderProps) => {

	const [ users, setUsers ] = useState<IUser[]>(initialUsersState);
	const [ total, setTotal ] = useState<number>(0);

	const dispatchUsers = useCallback((users: IUser[]) => {
		setUsers(users);
	}, []);

	const updateUser = useCallback((userToUpdate: Partial<IUser> & { id: Id | string }) => {
		setUsers(prevUsers => prevUsers.map(user => {
			if (user.id === userToUpdate.id) {
				return {
					...user,
					...userToUpdate,
				};
			}
			return user;
		}));
	}, []);

	const contextValues = useMemo(() => ({
		dispatchUsers,
		users,
		total,
		updateUser,
	}), [
		total,
		users,
		dispatchUsers,
		updateUser,
	]);

	return(
		<UsersContext.Provider value={ contextValues }>
			{ children }
		</UsersContext.Provider>
	);

};

export default UsersProvider;