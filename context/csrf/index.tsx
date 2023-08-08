'use client';

import { createContext } from 'react';

type CsrfContextValues = {
	csrfToken: string | null;
	dispatchCsrfToken: (token: string) => void;
}

const CsrfContext = createContext<CsrfContextValues | null>(null);
export default CsrfContext;


