'use client';

import { type Session } from 'next-auth';
import { createContext } from 'react';

import { IUserPopulated } from '@/schemas/user/populated.schema';
import { LoadingState } from '@/types/utils/loading.type';
import { Permission } from '@/utils/roles';

export type AuthContextValue = {
	currentUser: IUserPopulated | null;
	fetchCurrentUser: () => Promise<IUserPopulated>,
	updateCurrentUser: (user: IUserPopulated) => Promise<void>,
	updateSession: () => Promise<Session | null>;
	can: (action: Permission) => boolean;
	loading: LoadingState,
	error: string | null,
	status: 'authenticated' | 'loading' | 'unauthenticated',
};

const AuthContext = createContext<AuthContextValue | null>(null);
export default AuthContext;