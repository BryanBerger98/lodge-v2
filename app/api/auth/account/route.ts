import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/config/database.config';
import { findUserById } from '@/database/user/user.repository';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, UNAUTHORIZED_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

import { authOptions } from '../[...nextauth]/route';

export const GET = async () => {

	try {
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

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		// const photoFileObject = await findFileByUrl(currentUserData.photo_url);

		// if (photoFileObject) {
		// 	const photoUrl = await getFileFromKey(photoFileObject);
		// 	currentUserData.photo_url = photoUrl ? photoUrl : '';
		// }


		return NextResponse.json(userData);
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