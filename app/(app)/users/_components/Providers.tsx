'use client';

import { ReactNode } from 'react';

import CsrfProvider from '@/context/csrf';
// import UsersProvider from '@/context/users';

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<CsrfProvider>
			{ children }
		</CsrfProvider>
	);
};

export default Providers;