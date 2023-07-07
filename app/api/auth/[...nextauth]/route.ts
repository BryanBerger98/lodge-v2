/* eslint-disable require-await */
import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { connectToDatabase } from '@/config/database.config';
import { findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils.type';
import { buildError } from '@/utils/error';
import { ACCOUNT_DISABLED_ERROR, INTERNAL_ERROR, MISSING_CREDENTIALS_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
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
						throw buildError({
							code: MISSING_CREDENTIALS_ERROR,
							message: 'Credentials are missing.',
							status: 422,
						});
					}

					const user = await findUserWithPasswordByEmail(credentials.email.toLowerCase().trim());

					if (!user) {
						throw buildError({
							code: USER_NOT_FOUND_ERROR,
							message: 'User not found.',
							status: 404,
						});
					}

					if (user.is_disabled) {
						throw buildError({
							code: ACCOUNT_DISABLED_ERROR,
							message: 'Account disabled.',
							status: 403,
						});
					}

					const isPasswordValid = await verifyPassword(credentials.password, user.password);

					if (!isPasswordValid) {
						throw buildError({
							code: WRONG_PASSWORD_ERROR,
							message: 'Wrong Password',
							status: 401,
						});
					}

					const updatedUser = await updateUser({
						id: user.id,
						last_login_date: new Date(), 
					}, { newDocument: true });

					const sanitizedUser: Optional<IUserWithPassword, 'password'> = updatedUser ? updatedUser : user;

					delete sanitizedUser.password;

					return sanitizedUser;
				} catch (error: any) {
					console.error(error);
					throw buildError({
						code: INTERNAL_ERROR,
						message: error.message || 'An error occured.',
						status: 500,
						data: error,
					});
				}
			},
		}),
	],
	callbacks: {
		async jwt ({ user, token, session, trigger }) {
			if (trigger === 'update' && session) {
				token.id = session.user.id;
				token.role = session.user.role;
				token.has_email_verified = session.user.has_email_verified;
				token.photo_url = session.user.photo_url;
				token.phone_number = session.user.phone_number;
				token.username = session.user.username;
				token.email = session.user.email;
			}
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.has_email_verified = user.has_email_verified;
				token.photo_url = user.photo_url;
				token.phone_number = user.phone_number;
				token.username = user.username;
				token.email = user.email;
			}
			return token;
		},
		session ({ session, token }) {
			session.user = {
				...session.user,
				...token, 
			};
			return session;
		},
	},
	secret: process.env.JWT_SECRET,
};


const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };