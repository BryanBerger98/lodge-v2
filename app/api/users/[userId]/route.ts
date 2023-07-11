import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database.config';
import { deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { deleteUserById, findUserById } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

export const DELETE = async (_: any, { params }: { params: { userId: string } }) => {
	try {

		const { userId } = params;

		if (!userId) {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'User id is missing.',
				status: 422,
			}));
		}

		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ 'admin' ] });

		const userData = await findUserById(userId);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		const photoFileObject = userData.photo_key ? await findFileByKey(userData.photo_key) : null;

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