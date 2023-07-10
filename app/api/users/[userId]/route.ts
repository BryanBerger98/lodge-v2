import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/config/database.config';
import { deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { deleteUserById, findUserById } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, UNAUTHORIZED_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

import { authOptions } from '../../auth/[...nextauth]/route';


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

		const session = await getServerSession(authOptions);
		const currentUser = session?.user;

		if (!currentUser?.id) {
			return sendError(buildError({
				code: UNAUTHORIZED_ERROR,
				message: 'Unauthorized.',
				status: 401,
			}));
		}

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