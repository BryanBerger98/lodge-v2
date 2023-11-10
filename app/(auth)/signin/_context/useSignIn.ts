import { useContext } from 'react';

import { SignInContext } from '.';

export const useSignIn = () => {
	const context = useContext(SignInContext);
	if (!context) {
		throw new Error('useSignIn was used outside of its Provider');
	}
	return context;
};