import { useContext } from 'react';

import { AuthContext } from '.';

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error('useAuthContext is null');
	}
	if (context === undefined) {
		throw new Error('useAuthContext was used outside of its Provider');
	}
	return context;
};

export default useAuth;