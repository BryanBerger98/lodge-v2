import { node } from 'prop-types';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type CsrfContextValues = {
	csrfToken: string | null;
	dispatchCsrfToken: (token: string) => void;
}

const CsrfContext = createContext<CsrfContextValues | null>(null);
export { CsrfContext };

export const useCsrfContext = () => {
	const context = useContext(CsrfContext);
	if (context === null) {
		throw new Error('useCsrfContext is null');
	}
	if (context === undefined) {
		throw new Error('useCsrfContext was used outside of its Provider');
	}
	return context;
};

type CsrfContextProviderProperties = {
	children: ReactNode;
}

const CsrfContextProvider = ({ children }: CsrfContextProviderProperties) => {

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

export default CsrfContextProvider;

CsrfContextProvider.propTypes = { children: node.isRequired };