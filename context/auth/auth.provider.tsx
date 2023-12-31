'use client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { IUserPopulated } from '@/schemas/user/populated.schema';
import { getCurrentLoggedInUser } from '@/services/auth.service';
import { LoadingState } from '@/types/utils/loading.type';
import { ApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';
import { Permission } from '@/utils/roles';

import AuthContext from '.';

const UNAUTH_WHITELIST_PATHNAMES = [
	'/signin',
	'/signup',
	'/forgot-password',
];

type AuthProviderProps = {
	children: ReactNode;
	currentUser?: IUserPopulated | null;
};

const AuthProvider: FC<AuthProviderProps> = ({ children, currentUser: initialCurrentUser = null }) => {

	const [ currentUser, setCurrentUser ] = useState<IUserPopulated | null>(initialCurrentUser);
	const [ loading, setLoading ] = useState<LoadingState>('idle');
	const [ error, setError ] = useState<string | null>(null);

	const router = useRouter();
	const pathname = usePathname();
	const [ , basePathname ] = pathname.split('/');
	const { status, update } = useSession();

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
					if (apiError.code === ApiErrorCode.USER_NOT_FOUND) {
						signOut()
							.catch(error => {
								console.error(error);
								setLoading('error');
								setError(error.message);
							});
					} else {
						console.error(apiError);
						setLoading('error');
						setError(getErrorMessage(apiError));
					}
				});
		}
		if (status === 'unauthenticated') {
			if (!UNAUTH_WHITELIST_PATHNAMES.includes(`/${ basePathname }`)) {
				router.replace('/signin');
			}
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

	const updateCurrentUser = useCallback(async (user: IUserPopulated) => {
		setCurrentUser({
			...currentUser,
			...user,
		});
		try {
			await update();
			return;
		} catch (error) {
			throw error;
		}
	}, [ setCurrentUser, currentUser, update ]);

	const updateSession = useCallback(async () => {
		return await update();
	}, [ update ]);

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