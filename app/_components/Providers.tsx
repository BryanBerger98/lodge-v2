'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import AuthProvider from '@/context/auth';
import CsrfProvider from '@/context/csrf';

type ProvidersProps = {
	children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	return (
		<SessionProvider>
			<AuthProvider>
				<CsrfProvider>
					{ children }
				</CsrfProvider>
			</AuthProvider>
		</SessionProvider>
	);
};

export default Providers;