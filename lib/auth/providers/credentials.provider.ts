import Credentials from 'next-auth/providers/credentials';

import { findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils';
import { buildError } from '@/utils/error';
import { ACCOUNT_DISABLED_ERROR, INTERNAL_ERROR, MISSING_CREDENTIALS_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { verifyPassword } from '@/utils/password.util';

const CredentialsProvider = Credentials({
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
});

export default CredentialsProvider;