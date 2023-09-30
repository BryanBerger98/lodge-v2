import { NextResponse } from 'next/server';

import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { deleteUserById, findUserById } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { FORBIDDEN_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

export const DELETE = async (_: any, { params }: { params: { user_id: string } }) => {
	try {

		const { user_id } = params;

		if (!user_id) {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'User id is missing.',
				status: 422,
			}));
		}

		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ 'owner', 'admin' ] });

		const userData = await findUserById(user_id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (userData.role === 'owner') {
			return sendError(buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			}));
		}

		const photoFileObject = userData.photo ? await findFileById(userData.photo.id) : null;

		if (photoFileObject) {
			await deleteFileFromKey(photoFileObject.key);
			await deleteFileById(photoFileObject.id);
		}

		await deleteUserById(userData.id);

		return NextResponse.json({ message: 'User deleted.' });
	} catch (error: any) {
		console.error(error);
		return sendError(buildError({
			code: INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};