'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import AuthContextProvider from '@/context/auth';
import CsrfContextProvider from '@/context/csrf';

type ProvidersProps = {
	children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	return (
		<SessionProvider>
			<AuthContextProvider>
				<CsrfContextProvider>
					{ children }
				</CsrfContextProvider>
			</AuthContextProvider>
		</SessionProvider>
	);
};

export default Providers;