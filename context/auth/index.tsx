'use client';

import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { getCurrentLoggedInUser } from '@/services/auth.service';
import { LoadingState } from '@/types/loading.type';
import { IUser } from '@/types/user.type';
import { ApiError } from '@/utils/error';
import { USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { Permission } from '@/utils/role.util';

type AuthContextValue = {
	currentUser: IUser | null;
	fetchCurrentUser: () => Promise<IUser>,
	updateCurrentUser: (user: IUser) => Promise<void>,
	updateSession: (sessionData: Partial<Session>) => Promise<Session | null>;
	can: (action: Permission) => boolean;
	loading: LoadingState,
	error: string | null,
	status: 'authenticated' | 'loading' | 'unauthenticated',
};

const AuthContext = createContext<AuthContextValue | null>(null);
export { AuthContext };

type AuthProviderProps = {
	children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

	const [ currentUser, setCurrentUser ] = useState<IUser | null>(null);
	const [ loading, setLoading ] = useState<LoadingState>('idle');
	const [ error, setError ] = useState<string | null>(null);

	const router = useRouter();
	const { status, data: session, update } = useSession();

	useEffect(() => {
		if (status === 'loading') {
			setLoading('pending');
		}
		if (status === 'authenticated') {
			getCurrentLoggedInUser()
				.then(user => {
					if (user.is_disabled) {
						signOut()
							.catch(error => {
								console.error(error);
								setLoading('error');
								setError(error.message);
							});
					}
					setCurrentUser(user);
					setLoading('idle');
				})
				.catch(error => {
					const apiError = error as ApiError<unknown>;
					if (apiError.code === USER_NOT_FOUND_ERROR) {
						signOut()
							.catch(error => {
								console.error(error);
								setLoading('error');
								setError(error.message);
							});
					} else {
						console.error(apiError);
						setLoading('error');
						setError(apiError.message);
					}
				});
		}
		if (status === 'unauthenticated') {
			router.replace('/signin');
			setCurrentUser(null);
			setLoading('idle');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ status ]);

	const fetchCurrentUser = useCallback(async () => {
		try {
			const user = await getCurrentLoggedInUser();
			setCurrentUser(user);
			return user;
		} catch (error) {
			throw error;
		}
	}, [ setCurrentUser ]);

	const updateCurrentUser = useCallback(async (user: IUser) => {
		setCurrentUser({
			...currentUser,
			...user,
		});
		try {
			await update({
				...session,
				user: {
					...currentUser,
					...user,
					photo_url: undefined,
				},
			});
			return;
		} catch (error) {
			throw error;
		}
	}, [ setCurrentUser, currentUser, session, update ]);

	const updateSession = useCallback(async (sessionData: Partial<Session>) => {
		return await update({
			...session,
			...sessionData,
		});
	}, [ session, update ]);

	const can = useCallback((action: Permission) => currentUser ? action[ currentUser.role ] : false, [ currentUser ]);

	const contextValues = useMemo(() => ({
		currentUser,
		fetchCurrentUser,
		updateCurrentUser,
		loading,
		error,
		updateSession,
		status,
		can,
	}), [
		currentUser,
		fetchCurrentUser,
		updateCurrentUser,
		loading,
		error,
		updateSession,
		status,
		can,
	]);

	return(
		<AuthContext.Provider value={ contextValues }>
			{ children }
		</AuthContext.Provider>
	);

};

export default AuthProvider;