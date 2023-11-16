import { useContext } from 'react';

import UserContext from '.';

const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser was used outside of its Provider.');
	}
	return context;
};

export default useUser;