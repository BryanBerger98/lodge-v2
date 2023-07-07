import { JWT } from 'next-auth/jwt';

import { IUser } from '@/types/user.type';

import { Id } from './config/database.config';
import { TokenAction } from './types/token.type';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

	interface User extends IUser {
		id?: string | Id;
	}

  interface Session {
    user: User
	token: JWT & IUser & {
		id?: string | Id;
		action?: TokenAction;
	}
  }
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends IUser {
		id?: string | Id;
		action?: TokenAction;
	}
}