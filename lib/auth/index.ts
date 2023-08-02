import { NextAuthOptions } from 'next-auth';

import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserByEmail, findUserById } from '@/database/user/user.repository';
import { MAGIC_LINK_SIGNIN_SETTING, findDefaultSettingByName } from '@/utils/settings';

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
		signIn: async ({ user, profile, email, account }) => {
			try {
				await connectToDatabase();

				const userExists = await findUserByEmail(user.email);

				if (account?.provider === 'credentials' && userExists) {
					return true;
				}

				if (account?.provider === 'email') {
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
				}

				if (account?.provider === 'google' && profile?.email) {
					const googleUserExists = await findUserByEmail(profile.email);
					if (googleUserExists?.provider_data === 'google') {
						return true;
					}
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
	secret: process.env.JWT_SECRET,
	debug: process.env.ENVIRONMENT === 'Development',
};

export default authOptions;