import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { UpdateUserAccountSchema } from '@/database/user/user.dto';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { IUser } from '@/types/user.type';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, UNAUTHORIZED_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

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

export const PUT = async (request: NextRequest) => {

	try {

		const body = await request.json();

		const { username, phone_number } = UpdateUserAccountSchema.parse(body);

		const updateObject: Partial<IUser> = {};

		if (username) {
			updateObject.username = username;
		}

		if (phone_number) {
			updateObject.phone_number = phone_number;
		}

		const session = await getServerSession(authOptions);
		const currentUser = session?.user;

		if (!currentUser?.id) {
			return sendError(buildError({
				code: UNAUTHORIZED_ERROR,
				message: 'Unauthorized.',
				status: 401,
			}));
		}

		const updatedUser = await updateUser({
			id: currentUser.id,
			...updateObject,
		}, { newDocument: true });

		return NextResponse.json(updatedUser);
	} catch (error: any) {
		console.error(error);
		if (error.name && error.name === 'ZodError') {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'Invalid input.',
				status: 422,
				data: error as ZodError,
			}));
		}
		return sendError(buildError({
			code: INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}

};