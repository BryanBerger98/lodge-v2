'use client';

import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { z } from 'zod';

import { CreateUserSchema } from '@/app/api/users/_schemas/create-user.schema';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { createUser as createUserRequest,
	deleteUser as deleteUserRequest,
	updateUser as updateUserRequest,
	fetchUserById } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

import UserContext from '.';

type UserProviderProps = {
	user: IUserPopulated | null;
};

const UserProvider = ({ user: initialUser, children }: PropsWithChildren<UserProviderProps>) => {

	const [ userId, setUserId ] = useState(initialUser?.id || null);
	const [ isMutating, setIsMutating ] = useState(false);

	const { data, error: swrError, isLoading, mutate } = useSWR<IUserPopulated | null>(userId, fetchUserById, { fallbackData: initialUser });

	const { getCsrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const updateUser = useCallback(async (user: Partial<IUserPopulated>) => {
		try {
			const csrfToken = getCsrfToken();
			if (!initialUser) {
				triggerErrorToast({
					title: 'Error',
					description: 'User not found.',
				});
				return null;
			}
			setIsMutating(true);
			const updatedUser = await mutate(updateUserRequest({
				...user,
				username: user.username ?? undefined,
				first_name: user.first_name ?? undefined,
				last_name: user.last_name ?? undefined,
				birth_date: user.birth_date ?? undefined,
				id: initialUser.id,
			}, { csrfToken }), {
				optimisticData: (currentData) => ({
					...initialUser,
					...currentData,
					...user,
					id: initialUser.id,
				}),
				populateCache: true,
				revalidate: false,
				rollbackOnError: true,
			});
			setIsMutating(false);
			return updatedUser || null;
		} catch (error) {
			setIsMutating(false);
			throw error;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ initialUser ]);

	const createUser = useCallback(async (user: z.infer<typeof CreateUserSchema>) => {
		try {
			const csrfToken = getCsrfToken();
			setIsMutating(true);
			const createdUser = await mutate(createUserRequest(user, { csrfToken }));
			setUserId(createdUser?.id || null);
			setIsMutating(false);
			return createdUser || null;
		} catch (error) {
			setIsMutating(false);
			throw error;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteUser = useCallback(async () => {
		try {
			const csrfToken = getCsrfToken();
			if (!initialUser) {
				triggerErrorToast({
					title: 'Error',
					description: 'User not found.',
				});
				return;
			}
			setIsMutating(true);
			await deleteUserRequest(initialUser.id, { csrfToken });
			await mutate(null);
			setIsMutating(false);
			return;
		} catch (error) {
			setIsMutating(false);
			throw error;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ initialUser ]);

	const contextValue = useMemo(() => ({
		user: data || null,
		error: swrError as ApiError<unknown> | undefined,
		refetchUser: mutate,
		updateUser,
		createUser,
		deleteUser,
		isMutating,
		isLoading,
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [ data, isLoading, isMutating, swrError ]);

	return (
		<UserContext.Provider value={ contextValue }>
			{ children }
		</UserContext.Provider>
	);
};

export default UserProvider;