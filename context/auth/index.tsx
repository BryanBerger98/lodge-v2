'use client';

import { node } from 'prop-types';
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

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

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error('useAuthContext is null');
	}
	if (context === undefined) {
		throw new Error('useAuthContext was used outside of its Provider');
	}
	return context;
};

type AuthContextProviderProperties = {
	children: ReactNode;
}

const AuthContextProvider: FC<AuthContextProviderProperties> = ({ children }) => {

	const [ currentUser, setCurrentUser ] = useState<IUser | null>(null);

	const [ csrfToken, setCsrfToken ] = useState<string | null>(null);

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

export default AuthContextProvider;

AuthContextProvider.propTypes = { children: node.isRequired };