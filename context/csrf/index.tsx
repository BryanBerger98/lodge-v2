import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

type CsrfContextValues = {
	csrfToken: string | null;
	dispatchCsrfToken: (token: string) => void;
}

const CsrfContext = createContext<CsrfContextValues | null>(null);
export { CsrfContext };


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