import { NextAuthOptions } from 'next-auth';
import { type JWT } from 'next-auth/jwt';

import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserById, findUserByEmail } from '@/database/user/user.repository';
import { SettingDataType, SettingName } from '@/schemas/setting';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { Env, Environment } from '@/utils/env.util';

import { connectToDatabase } from '../database';

import DatabaseAdapter from './adapters/database.adapter';
import CredentialsProvider from './providers/credentials.provider';
import EmailProvider from './providers/email.provider';
import GoogleProvider from './providers/google.provider';

const JWT_MAX_AGE = 7 * 24 * 60 * 60;

const authOptions: NextAuthOptions = {
	adapter: DatabaseAdapter,
	providers: [
		...(GoogleProvider ? [ GoogleProvider ] : []),
		EmailProvider,
		CredentialsProvider,
	],
	pages: {
		signIn: '/signin',
		error: '/error', 
	},
	callbacks: {
		async jwt ({ user, token, trigger }): Promise<JWT> {
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
		signIn: async ({ user, profile, email, account }) => {
			try {
				await connectToDatabase();
				
				if (!user.email) {
					throw buildApiError({
						code: ApiErrorCode.MISSING_CREDENTIALS,
						status: StatusCode.UNPROCESSABLE_ENTITY,
					});
				}

				const userExists = await findUserByEmail(user.email);

				if (account?.provider === 'credentials' && userExists) {
					return true;
				}

				if (account?.provider === 'email') {
					const registeredMagicLinkSignInSetting = await findSettingByName(SettingName.MAGIC_LINK_SIGNIN);

					if (
						email?.verificationRequest
					&& (registeredMagicLinkSignInSetting && registeredMagicLinkSignInSetting.data_type === SettingDataType.BOOLEAN && registeredMagicLinkSignInSetting.value)
					&& userExists
					) {
						return true;
					}

					if (userExists) {
						return true;
					}
				}

				if (account?.provider === 'google' && profile?.email) {
					const googleUserExists = await findUserByEmail(profile.email);
					if (googleUserExists?.provider_data === 'google') {
						return true;
					}
					if (!googleUserExists) {
						return true;
					}
					throw buildApiError({
						code: ApiErrorCode.WRONG_AUTH_METHOD,
						status: StatusCode.CONFLICT,
					});
				}

				return '/signup';
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: JWT_MAX_AGE, 
	},
	jwt: { maxAge: JWT_MAX_AGE },
	secret: Env.JWT_SECRET,
	debug: Env.ENVIRONMENT === Environment.DEVELOPMENT,
};

export default authOptions;