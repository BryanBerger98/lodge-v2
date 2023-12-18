import { useContext } from 'react';

import CsrfContext from '.';

const useCsrf = () => {
	const context = useContext(CsrfContext);
	if (!context) {
		throw new Error('useCsrf was used outside of its Provider');
	}
	return context;
};

export default useCsrf;