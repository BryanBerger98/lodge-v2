import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { findFileByKey } from '@/database/file/file.repository';
import { UpdateUserAccountSchema } from '@/database/user/user.dto';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { getFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { IUser } from '@/types/user.type';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

export const GET = async () => {

	try {
		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard();

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		const photoFileObject = userData.photo_key ? await findFileByKey(userData.photo_key) : null;

		if (photoFileObject) {
			const photoUrl = await getFileFromKey(photoFileObject);
			userData.photo_url = photoUrl ? photoUrl : '';
		}

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

		await connectToDatabase();

		const body = await request.json();

		const { username, phone_number } = UpdateUserAccountSchema.parse(body);

		const updateObject: Partial<IUser> = {};

		if (username) {
			updateObject.username = username;
		}

		if (phone_number) {
			updateObject.phone_number = phone_number;
		}

		const { user: currentUser } = await setServerAuthGuard();

		currentUser.id;

		const updatedUser = await updateUser({
			id: currentUser.id,
			updated_by: currentUser.id,
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