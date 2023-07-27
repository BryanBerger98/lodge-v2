import { redirect as nextRedirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { findUserById, findUserWithPasswordById } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { IUser, UserRoleWithOwner } from '@/types/user.type';

import { buildError } from '../error';
import { FORBIDDEN_ERROR, MISSING_CREDENTIALS_ERROR, UNAUTHORIZED_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../error/error-codes';
import { verifyPassword } from '../password.util';

import authOptions from './auth-options';

export interface ProtectionOptions {
	rolesWhiteList?: UserRoleWithOwner[];
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
		throw buildError({
			code: UNAUTHORIZED_ERROR,
			message: 'Unauthorized.',
			status: 401,
		});
	}

	const currentUserData = await findUserById(currentUser.id);

	if (!currentUserData) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		throw buildError({
			code: UNAUTHORIZED_ERROR,
			message: 'Unauthorized.',
			status: 401,
		});
	}

	if (rolesWhiteList.length > 0 && (!session || !currentUser?.id || !rolesWhiteList?.includes(currentUserData.role))) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		if (!session || !currentUser?.id) {
			throw buildError({
				code: UNAUTHORIZED_ERROR,
				message: 'Unauthorized.',
				status: 401,
			});
		}
		if (!rolesWhiteList?.includes(currentUserData.role)) {
			throw buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			});
		}
	}

	return {
		session,
		user: currentUserData, 
	};
};

export const authenticateUserWithPassword = async (userToAuthenticate: IUser, password?: string) => {
	try {
		if (!password) {
			throw buildError({
				code: MISSING_CREDENTIALS_ERROR,
				message: 'Missing credentials.',
				status: 401,
			});
		}

		const user = await findUserWithPasswordById(userToAuthenticate.id);

		if (!user) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		const isPasswordValid = await verifyPassword(password, user.password);

		if (!isPasswordValid) {
			throw buildError({
				code: WRONG_PASSWORD_ERROR,
				message: 'Wrong password.',
				status: 401,
			});
		}

		return;
	} catch (error) {
		throw error;
	}
};