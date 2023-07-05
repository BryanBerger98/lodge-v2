import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/config/database.config';
import { findUserById } from '@/database/user/user.repository';
import { buildError, sendError } from '@/utils/error.util';

import { authOptions } from '../[...nextauth]/route';

export const GET = async () => {

	try {
		await connectToDatabase();

		const session = await getServerSession(authOptions);
		const currentUser = session?.user;

		if (!currentUser?.id) {
			return sendError(buildError({
				message: 'Unauthorized.',
				status: 401,
			}));
		}

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
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
	} catch (error) {
		sendError(error);
	}
};