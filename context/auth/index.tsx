'use client';

import { useSession } from 'next-auth/react';
import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { getCurrentLoggedInUser } from '@/services/auth.service';
import { IUser } from '@/types/user.type';

type AuthContextValue = {
	currentUser: IUser | null;
	getCurrentUser: () => Promise<IUser>,
	dispatchCurrentUser: (user: IUser) => void,
	csrfToken: string | null,
	dispatchCsrfToken: (token: string) => void,
};

const AuthContext = createContext<AuthContextValue | null>(null);
export { AuthContext };

type AuthProviderProps = {
	children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

	const [ currentUser, setCurrentUser ] = useState<IUser | null>(null);

	const [ csrfToken, setCsrfToken ] = useState<string | null>(null);

	const { status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			getCurrentLoggedInUser()
				.then(user => setCurrentUser(user))
				.catch(console.error);
		}
	}, [ status ]);

	const getCurrentUser = useCallback(async () => {
		try {
			const user = await getCurrentLoggedInUser();
			setCurrentUser(user);
			return user;
		} catch (error) {
			throw error;
		}
	}, [ setCurrentUser ]);

	const dispatchCurrentUser = useCallback((user: IUser) => {
		setCurrentUser({
			...currentUser,
			...user,
		});
	}, [ setCurrentUser, currentUser ]);

	const dispatchCsrfToken = useCallback((token: string) => {
		setCsrfToken(token);
	}, [ setCsrfToken ]);

	const contextValues = useMemo(() => ({
		currentUser,
		getCurrentUser,
		dispatchCurrentUser,
		csrfToken,
		dispatchCsrfToken,
	}), [
		currentUser,
		getCurrentUser,
		dispatchCurrentUser,
		csrfToken,
		dispatchCsrfToken,
	]);

	return(
		<AuthContext.Provider value={ contextValues }>
			{ children }
		</AuthContext.Provider>
	);

};

export default AuthProvider;