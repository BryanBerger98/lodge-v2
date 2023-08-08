import { useContext } from 'react';

import UsersContext from '.';

const useUsers = () => {
	const context = useContext(UsersContext);
	if (context === null) {
		throw new Error('useUsers is null');
	}
	if (context === undefined) {
		throw new Error('useUsers was used outside of its Provider');
	}
	return context;
};

export default useUsers;