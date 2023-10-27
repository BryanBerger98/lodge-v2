import { NextResponse } from 'next/server';

import { updateFileURL } from '@/database/file/file.repository';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { getFieldSignedURL } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { User } from '@/schemas/user';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';

import { UpdateUserAccountSchema } from './_schemas/update-user-account.schema';

export const GET = routeHandler(async () => {

	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard();

	const userData = await findUserById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
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
});

export const PUT = routeHandler(async (request) => {
	await connectToDatabase();

	const body = await request.json();

	const { username, phone_number } = UpdateUserAccountSchema.parse(body);

	const updateObject: Partial<User> = {};

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
});