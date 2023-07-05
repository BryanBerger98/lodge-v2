import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { connectToDatabase } from '@/config/database.config';
import { findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils.type';
import { verifyPassword } from '@/utils/password.util';

export const authOptions: NextAuthOptions = {
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'example@example.com', 
				},
				password: {
					label: 'Password',
					type: 'password', 
				},
			},
			authorize: async (credentials) => {
				try {
					await connectToDatabase();

					if (!credentials) {
						return null;
					}

					const user = await findUserWithPasswordByEmail(credentials.email.toLowerCase().trim());

					if (!user) {
						throw new Error('No user registered.');
					}

					if (user.is_disabled) {
						throw new Error('User disabled');
					}

					const isPasswordValid = await verifyPassword(credentials.password, user.password);

					if (!isPasswordValid) {
						throw new Error('Wrong password.');
					}

					const updatedUser = await updateUser({
						id: user.id,
						last_login_date: new Date(), 
					}, { newDocument: true });

					const sanitizedUser: Optional<IUserWithPassword, 'password'> = updatedUser ? updatedUser : user;

					delete sanitizedUser.password;

					return sanitizedUser;
				} catch (error) {
					throw error;
				}
			},
		}),
	],
	callbacks: {
		session ({ session, token }) {
			if (session?.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
		jwt ({ user, token }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
	},
	secret: process.env.JWT_SECRET,
};


const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };

// import type { NextApiRequest, NextApiResponse } from "next"
// import NextAuth from "next-auth"

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await NextAuth(req, res, {
//     ...
//   })
// }