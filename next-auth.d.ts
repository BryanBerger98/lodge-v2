import { JWT } from 'next-auth/jwt';

import { IUser } from '@/types/user.type';

import { Id } from './config/database.config';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

	interface User extends IUser {
		id?: string | Id;
	}

  interface Session {
    user: User
	token: JWT & {
		id?: string | Id;
		email: string;
		action: 'reset_password' | 'account_verification';
		role: 'admin' | 'user';
	}
  }
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		id?: string | Id;
		email: string;
		action: 'reset_password' | 'account_verification';
		role: 'admin' | 'user';
	}
}