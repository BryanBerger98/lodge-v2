'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useState } from 'react';

import RefreshTokenHandler from '@/components/utils/auth/RefetchTokenHandler';

const AuthProvider = dynamic(() => import('@/context/auth/auth.provider'));
const CsrfProvider = dynamic(() => import('@/context/csrf/csrf.provider'));

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