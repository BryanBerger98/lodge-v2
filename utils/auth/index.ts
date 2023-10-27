import { redirect as nextRedirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { findUserById, findUserWithPasswordById } from '@/database/user/user.repository';
import authOptions from '@/lib/auth';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { User } from '@/schemas/user';
import { UserPopulated } from '@/schemas/user/populated.schema';

import { buildApiError } from '../api/error';
import { ApiErrorCode } from '../api/error/error-codes.util';
import { StatusCode } from '../api/http-status';
import { verifyPassword } from '../password.util';

export interface ProtectionOptions {
	rolesWhiteList?: Role[];
	redirect?: boolean | string;
}

export const setServerAuthGuard = async (options?: ProtectionOptions) => {
	const session = await getServerSession(authOptions);
	const currentUser = session?.user;

	await connectToDatabase();

	const { rolesWhiteList = [], redirect = false } = options || {
		rolesWhiteList: [],
		redirect: false, 
	};

	if (!session || !currentUser?.id) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		throw buildApiError({ status: StatusCode.UNAUTHORIZED });
	}

	const currentUserData = await findUserById(currentUser.id);

	if (!currentUserData) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		throw buildApiError({ status: StatusCode.UNAUTHORIZED });
	}

	if (rolesWhiteList.length > 0 && (!session || !currentUser?.id || !rolesWhiteList?.includes(currentUserData.role))) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		if (!session || !currentUser?.id) {
			throw buildApiError({ status: StatusCode.UNAUTHORIZED });
		}
		if (!rolesWhiteList?.includes(currentUserData.role)) {
			throw buildApiError({ status: StatusCode.FORBIDDEN });
		}
	}

	return {
		session,
		user: currentUserData, 
	};
};

export const authenticateUserWithPassword = async (userToAuthenticate: User | UserPopulated, password?: string) => {
	try {
		if (!password) {
			throw buildApiError({
				code: ApiErrorCode.MISSING_CREDENTIALS,
				status: StatusCode.UNPROCESSABLE_ENTITY,
			});
		}

		const user = await findUserWithPasswordById(userToAuthenticate.id);

		if (!user) {
			throw buildApiError({
				code: ApiErrorCode.USER_NOT_FOUND,
				status: StatusCode.NOT_FOUND,
			});
		}

		if (!user.password) {
			throw buildApiError({
				code: ApiErrorCode.WRONG_AUTH_METHOD,
				status: StatusCode.UNPROCESSABLE_ENTITY,
			});
		}

		const isPasswordValid = await verifyPassword(password, user.password);

		if (!isPasswordValid) {
			throw buildApiError({
				code: ApiErrorCode.WRONG_PASSWORD,
				status: StatusCode.UNAUTHORIZED,
			});
		}

		return;
	} catch (error) {
		throw error;
	}
};