'use client';

import { type Session } from 'next-auth';
import { createContext } from 'react';

import { IUser } from '@/types/user.type';
import { LoadingState } from '@/types/utils/loading.type';
import { Permission } from '@/utils/roles';

export type AuthContextValue = {
	currentUser: IUser | null;
	fetchCurrentUser: () => Promise<IUser>,
	updateCurrentUser: (user: IUser) => Promise<void>,
	updateSession: () => Promise<Session | null>;
	can: (action: Permission) => boolean;
	loading: LoadingState,
	error: string | null,
	status: 'authenticated' | 'loading' | 'unauthenticated',
};

const AuthContext = createContext<AuthContextValue | null>(null);
export default AuthContext;