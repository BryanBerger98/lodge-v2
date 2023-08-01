import { JWT } from 'next-auth/jwt';

import { Id } from '@/lib/database';
import { AuthProvider, IUser } from '@/types/user.type';

import { TokenAction } from './types/token.type';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

	interface User extends IUser {
		id: string | Id;
		provider_data: AuthProvider;
		email: string;
	}

  interface Session {
    user: User
	token: JWT & IUser & {
		id: string | Id;
		action?: TokenAction;
		provider_data: AuthProvider;
		email: string;
	}
  }
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends IUser {
		id: string | Id;
		action?: TokenAction;
		provider_data: AuthProvider;
		email: string;
	}
}