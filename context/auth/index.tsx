'use client';

import { type Session } from 'next-auth';
import { createContext } from 'react';

import { UserPopulated } from '@/schemas/user';
import { LoadingState } from '@/types/utils/loading.type';
import { Permission } from '@/utils/roles';

export type AuthContextValue = {
	currentUser: UserPopulated | null;
	fetchCurrentUser: () => Promise<UserPopulated>,
	updateCurrentUser: (user: UserPopulated) => Promise<void>,
	updateSession: () => Promise<Session | null>;
	can: (action: Permission) => boolean;
	loading: LoadingState,
	error: string | null,
	status: 'authenticated' | 'loading' | 'unauthenticated',
};

const AuthContext = createContext<AuthContextValue | null>(null);
export default AuthContext;