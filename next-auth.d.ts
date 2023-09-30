import type { Awaitable } from 'next-auth';
import type { AdapterUser as NextAuthAdapterUser, Adapter as NextAuthAdapter } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

import { AuthProvider, IUser, UserRole } from '@/types/user.type';

import { TokenAction } from './types/token.type';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

	interface User extends IUser {
		id: string;
		provider_data: AuthProvider;
		email: string;
	}

  interface Session {
    user: User
	token: JWT & IUser & {
		id: string;
		action?: TokenAction;
		provider_data: AuthProvider;
		email: string;
	}
  }
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends IUser {
		id: string;
		action?: TokenAction;
		provider_data: AuthProvider;
		email: string;
	}
}

declare module 'next-auth/adapters' {

	interface AdapterUser extends NextAuthAdapterUser {
		emailVerified?: Date | null;
		role: UserRole;
	}

	interface Adapter extends NextAuthAdapter {
		createUser: (user: Omit<AdapterUser, 'id'>) => Awaitable<AdapterUser>;
	}
}