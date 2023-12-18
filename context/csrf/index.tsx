'use client';

import { createContext } from 'react';

type CsrfContextValues = {
	csrfToken: string | null;
	dispatchCsrfToken: (token: string) => void;
	getCsrfToken: (options?: {
		required_error?: string | undefined;
		error_title?: string | undefined;
	} | undefined) => string;
}

const CsrfContext = createContext<CsrfContextValues | null>(null);
export default CsrfContext;
