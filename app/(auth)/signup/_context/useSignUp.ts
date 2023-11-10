import { useContext } from 'react';

import { SignUpContext } from '.';

export const useSignUp = () => {
	const context = useContext(SignUpContext);
	if (!context) {
		throw new Error('useSignUp was used outside of its Provider');
	}
	return context;
};