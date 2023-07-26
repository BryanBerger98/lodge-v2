'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useState } from 'react';

import RefreshTokenHandler from '@/components/utils/auth/RefetchTokenHandler';
import AuthProvider from '@/context/auth';
import CsrfProvider from '@/context/csrf';

type ProvidersProps = {
	children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {

	const [ refetchInterval, setRefetchInterval ] = useState(0);

	return (
		<SessionProvider refetchInterval={ refetchInterval }>
			<AuthProvider>
				<CsrfProvider>
					{ children }
					<RefreshTokenHandler setRefetchInterval={ setRefetchInterval } />
				</CsrfProvider>
			</AuthProvider>
		</SessionProvider>
	);
};

export default Providers;