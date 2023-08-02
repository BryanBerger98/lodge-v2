/* eslint-disable require-await */
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Email from 'next-auth/providers/email';

import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserByEmail, findUserById, findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import clientPromise from '@/lib/mongodb';
import { IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils.type';
import { buildError } from '@/utils/error';
import { ACCOUNT_DISABLED_ERROR, INTERNAL_ERROR, MISSING_CREDENTIALS_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { verifyPassword } from '@/utils/password.util';

import { sendMagicLinkSignInEmail } from '../email';
import { MAGIC_LINK_SIGNIN_SETTING, findDefaultSettingByName } from '../settings';

const authOptions: NextAuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		Email({
			sendVerificationRequest: async ({ url, identifier }) => {
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

					await sendMagicLinkSignInEmail(user, url);
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
	pages: { signIn: '/signin' },
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

			const userExists = await findUserByEmail(user.email);

			if (userExists && credentials) {
				return true;
			}

			const registeredMagicLinkSignInSetting = await findSettingByName(MAGIC_LINK_SIGNIN_SETTING);
			const defaultMagicLinkSignInSetting = findDefaultSettingByName(MAGIC_LINK_SIGNIN_SETTING);

			const magicLinkSignInSetting = registeredMagicLinkSignInSetting || defaultMagicLinkSignInSetting || null;

			if (
				email?.verificationRequest
				&& (magicLinkSignInSetting && magicLinkSignInSetting.data_type === 'boolean' && magicLinkSignInSetting.value)
				&& userExists
			) {
				return true;
			}
			if (userExists) {
				return true;
			}
			return '/signup';
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