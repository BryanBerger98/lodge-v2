import { ReactNode, useCallback, useMemo, useState } from 'react';

import CsrfContext from '.';

type CsrfProviderProps = {
	children: ReactNode;
}

const CsrfProvider = ({ children }: CsrfProviderProps) => {

	const [ csrfToken, setCsrfToken ] = useState<string | null>(null);

	const dispatchCsrfToken = useCallback((token: string) => {
		setCsrfToken(token);
	}, [ setCsrfToken ]);

	const contextValues = useMemo(() => ({
		csrfToken,
		dispatchCsrfToken,
	}), [
		csrfToken,
		dispatchCsrfToken,
	]);

	return(
		<CsrfContext.Provider value={ contextValues }>
			{ children }
		</CsrfContext.Provider>
	);

};

export default CsrfProvider;