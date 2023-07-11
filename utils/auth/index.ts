import { redirect as nextRedirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/config/database.config';
import { UserRole } from '@/types/user.type';

import { buildError } from '../error';
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from '../error/error-codes';

export interface ProtectionOptions {
	rolesWhiteList?: UserRole[];
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

	if (!session && !currentUser?.id) {
		if (redirect) {
			return nextRedirect(typeof redirect === 'boolean' ? '/' : redirect);
		}
		throw buildError({
			code: UNAUTHORIZED_ERROR,
			message: 'Unauthorized.',
			status: 401,
		});
	}

	if (rolesWhiteList.length > 0 && (!session || !currentUser?.id || !rolesWhiteList?.includes(currentUser.role))) {
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
		if (!rolesWhiteList?.includes(currentUser.role)) {
			throw buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			});
		}
	}

	return session;
};