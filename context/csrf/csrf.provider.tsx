'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';

import CsrfContext from '.';

type CsrfProviderProps = {
	children: ReactNode;
	csrfToken?: string;
}

const CsrfProvider = ({ children, csrfToken: initialCsrfToken }: CsrfProviderProps) => {

	const [ csrfToken, setCsrfToken ] = useState<string | null>(initialCsrfToken || null);

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