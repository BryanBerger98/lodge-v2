import { NextRequest, NextResponse } from 'next/server';

import { updateFileURL } from '@/database/file/file.repository';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { getFieldSignedURL } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { IUser } from '@/types/user.type';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltError, sendBuiltErrorWithSchemaValidation } from '@/utils/error';
import { USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

import { UpdateUserAccountSchema } from './_schemas/update-user-account.schema';

export const GET = async () => {

	try {
		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard();

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		if (userData.photo && userData.photo.url_expiration_date && userData.photo.url_expiration_date < new Date()) {
			const photoUrl = await getFieldSignedURL(userData.photo.key, 24 * 60 * 60);
			const updatedFile = await updateFileURL({
				id: userData.photo.id,
				url: photoUrl,
			});
			userData.photo = updatedFile;
		}

		return NextResponse.json(userData);
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
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
		return sendBuiltErrorWithSchemaValidation(error);
	}

};