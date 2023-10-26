import type { Awaitable } from 'next-auth';
import type { AdapterUser as NextAuthAdapterUser, Adapter as NextAuthAdapter } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

import { Role } from './schemas/role.schema';
import { UserPopulated } from './schemas/user/populated.schema';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

	interface User extends UserPopulated {}

	interface Session {
		user: User
		token: JWT & UserPopulated & {
			action?: TokenAction;
		}
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends UserPopulated {
		action?: TokenAction;
	}
}

declare module 'next-auth/adapters' {

	interface AdapterUser extends NextAuthAdapterUser {
		emailVerified?: Date | null;
		role: Role;
	}

	interface Adapter extends NextAuthAdapter {
		createUser: (user: Omit<AdapterUser, 'id'>) => Awaitable<AdapterUser | null>;
	}
}