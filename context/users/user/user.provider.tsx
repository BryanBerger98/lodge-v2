'use client';

import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { UserPopulated } from '@/schemas/user/populated.schema';
import { fetchUserById } from '@/services/users.service';

import UserContext from '.';

type UserProviderProps = {
	user: UserPopulated | null;
};

const UserProvider = ({ user: initialUser, children }: PropsWithChildren<UserProviderProps>) => {

	const [ user, setUser ] = useState<UserPopulated | null>(initialUser);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const fetchUser = useCallback(async (id?: string) => {
		const userId = id || user?.id;
		if (userId) {
			setIsLoading(true);
			try {
				const userData = await fetchUserById(userId);
				setUser(userData);
				return userData;
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
	}, [ user ]);

	useEffect(() => {
		const userId = user?.id;
		if (userId) {
			fetchUser(userId);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const contextValue = useMemo(() => ({
		user,
		setUser,
		refetchUser: fetchUser,
		isLoading,
		setIsLoading,
	}), [ user, fetchUser, isLoading ]);

	return (
		<UserContext.Provider value={ contextValue }>
			{ children }
		</UserContext.Provider>
	);
};

export default UserProvider;