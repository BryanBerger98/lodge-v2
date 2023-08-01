/* eslint-disable require-await */
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Email from 'next-auth/providers/email';

import { findUserByEmail, findUserById, findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import clientPromise from '@/lib/mongodb';
import { IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils.type';
import { buildError } from '@/utils/error';
import { ACCOUNT_DISABLED_ERROR, INTERNAL_ERROR, MISSING_CREDENTIALS_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { verifyPassword } from '@/utils/password.util';

import { sendMagicLinkSignInEmail } from '../email';

const authOptions: NextAuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		Email({
			// server: {
			// 	host: process.env.EMAIL_HOST,
			// 	port: process.env.EMAIL_PORT,
			// 	auth: {
			// 		user: process.env.EMAIL_USER,
			// 		pass: process.env.EMAIL_PASS,
			// 	},
			//   },
			//   from: process.env.EMAIL_FROM,
			sendVerificationRequest: async ({ url, identifier, provider }) => {
				try {
					await connectToDatabase();
					const user = await findUserByEmail(identifier);

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

					console.log(url);

					const result = await sendMagicLinkSignInEmail(user, { token: url });

					console.log(result);

					return;
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
						updated_by: user.id,
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
		async jwt ({ user, token, trigger }) {
			if (trigger === 'update') {
				await connectToDatabase();
				const updatedUser = await findUserById(token.id);
				if (updatedUser) {
					return {
						...token,
						...updatedUser,
					};
				}
			}
			if (user) {
				return {
					...token,
					...user,
				};
			}
			return { ...token };
		},
		session ({ session, token }) {
			session.user = {
				...session.user,
				...token, 
			};
			return session;
		},
		signIn: async ({ user, credentials, email }) => {
			await connectToDatabase();

			if (credentials) {
				console.log('CREDENTIALS', credentials);
				return true;
			}

			return '/signin';
			
			//   if (userExists) {
			// 	return true;   //if the email exists in the User collection, email them a magic login link
			//   } else {
			// 	return "/register"; 
			//   }
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60, 
	},
	jwt: { maxAge: 7 * 24 * 60 * 60 },
	secret: process.env.JWT_SECRET,
};

export default authOptions;