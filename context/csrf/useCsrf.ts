import { useContext } from 'react';

import CsrfContext from '.';

const useCsrf = () => {
	const context = useContext(CsrfContext);
	if (context === null) {
		throw new Error('useCsrf is null');
	}
	if (context === undefined) {
		throw new Error('useCsrf was used outside of its Provider');
	}
	return context;
};

export default useCsrf;