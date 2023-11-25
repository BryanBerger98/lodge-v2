import Credentials from 'next-auth/providers/credentials';

import { findUserWithPasswordByEmail, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { UserPopulatedWithPassword } from '@/schemas/user/populated.schema';
import { Optional } from '@/types/utils';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
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
				throw buildApiError({
					code: ApiErrorCode.MISSING_CREDENTIALS,
					status: StatusCode.UNPROCESSABLE_ENTITY,
				});
			}

			const user = await findUserWithPasswordByEmail(credentials.email.toLowerCase().trim());

			if (!user) {
				throw buildApiError({
					code: ApiErrorCode.USER_NOT_FOUND,
					status: StatusCode.NOT_FOUND,
				});
			}

			if (user.is_disabled) {
				throw buildApiError({
					code: ApiErrorCode.ACCOUNT_DISABLED,
					status: StatusCode.UNAUTHORIZED,
				});
			}

			if (!user.password) {
				throw buildApiError({
					code: ApiErrorCode.WRONG_AUTH_METHOD,
					status: StatusCode.CONFLICT,
				});
			}

			const isPasswordValid = await verifyPassword(credentials.password, user.password);

			if (!isPasswordValid) {
				throw buildApiError({
					code: ApiErrorCode.WRONG_PASSWORD,
					status: StatusCode.UNAUTHORIZED,
				});
			}

			const updatedUser = await updateUser({
				id: user.id,
				updated_by: user.id,
				last_login_date: new Date(), 
			});

			const sanitizedUser: Optional<UserPopulatedWithPassword, 'password'> = updatedUser ? updatedUser : user;

			delete sanitizedUser.password;

			return sanitizedUser;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	},
});

export default CredentialsProvider;