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
	const { data, error: swrError, isLoading, mutate } = useSWR<IUserPopulated | null>(userId, fetchUserById, { fallbackData: initialUser });

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const updateUser = useCallback(async (user: Partial<IUserPopulated>) => {
		try {
			if (!csrfToken) {
				triggerErrorToast({
					title: 'Error',
					description: 'Invalid CSRF token.',
				});
				return null;
			}
			if (!initialUser) {
				triggerErrorToast({
					title: 'Error',
					description: 'User not found.',
				});
				return null;
			}
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
			return updatedUser || null;
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
			return null;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken, initialUser ]);

	const createUser = useCallback(async (user: z.infer<typeof CreateUserSchema>) => {
		try {
			if (!csrfToken) {
				triggerErrorToast({
					title: 'Error',
					description: 'Invalid CSRF token.',
				});
				return null;
			}
			const createdUser = await mutate(createUserRequest(user, { csrfToken }));
			setUserId(createdUser?.id || null);
			return createdUser || null;
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
			return null;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken ]);

	const deleteUser = useCallback(async () => {
		try {
			if (!csrfToken) {
				triggerErrorToast({
					title: 'Error',
					description: 'Invalid CSRF token.',
				});
				return;
			}
			if (!initialUser) {
				triggerErrorToast({
					title: 'Error',
					description: 'User not found.',
				});
				return;
			}
			await deleteUserRequest(initialUser.id, { csrfToken });
			await mutate(null);
			return;
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
			return;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken, initialUser ]);

	const contextValue = useMemo(() => ({
		user: data || null,
		error: swrError as ApiError<unknown> | undefined,
		refetchUser: mutate,
		updateUser,
		createUser,
		deleteUser,
		isLoading,
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [ data, isLoading, swrError ]);

	return (
		<UserContext.Provider value={ contextValue }>
			{ children }
		</UserContext.Provider>
	);
};

export default UserProvider;