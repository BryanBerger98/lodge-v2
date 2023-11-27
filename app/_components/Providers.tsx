'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useState } from 'react';

import RefreshTokenHandler from '@/components/utils/auth/RefetchTokenHandler';
import { IUserPopulated } from '@/schemas/user/populated.schema';

const AuthProvider = dynamic(() => import('@/context/auth/auth.provider'));
const CsrfProvider = dynamic(() => import('@/context/csrf/csrf.provider'));

type ProvidersProps = {
	children: ReactNode;
	values: {
		currentUser: IUserPopulated | null;
	},
};

const Providers = ({ children, values }: ProvidersProps) => {

	const [ refetchInterval, setRefetchInterval ] = useState(0);

	return (
		<SessionProvider refetchInterval={ refetchInterval }>
			<AuthProvider currentUser={ values.currentUser } >
				<CsrfProvider>
					{ children }
					<RefreshTokenHandler setRefetchInterval={ setRefetchInterval } />
				</CsrfProvider>
			</AuthProvider>
		</SessionProvider>
	);
};

export default Providers;