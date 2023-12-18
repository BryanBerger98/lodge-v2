'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';

import useErrorToast from '@/hooks/error/useErrorToast';

import CsrfContext from '.';

type CsrfProviderProps = {
	children: ReactNode;
	csrfToken?: string;
}

const CsrfProvider = ({ children, csrfToken: initialCsrfToken }: CsrfProviderProps) => {

	const [ csrfToken, setCsrfToken ] = useState<string | null>(initialCsrfToken || null);

	const { triggerErrorToast } = useErrorToast();

	const dispatchCsrfToken = useCallback((token: string) => {
		setCsrfToken(token);
	}, [ setCsrfToken ]);

	const getCsrfToken = useCallback((options?: { required_error?: string, error_title?: string }) => {
		const { required_error = 'Invalid CSRF Token.', error_title = 'Error' } = options || {};
		if (!csrfToken) {
			triggerErrorToast({
				title: error_title,
				description: required_error,
			});
			throw new Error(required_error);
		}
		return csrfToken;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ csrfToken ]);

	const contextValues = useMemo(() => ({
		csrfToken,
		dispatchCsrfToken,
		getCsrfToken,
	}), [
		csrfToken,
		dispatchCsrfToken,
		getCsrfToken,
	]);

	return(
		<CsrfContext.Provider value={ contextValues }>
			{ children }
		</CsrfContext.Provider>
	);

};

export default CsrfProvider;