import { NextResponse } from 'next/server';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { deleteUserById, findUserByEmail, findUserById, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { Role } from '@/schemas/role.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';

import { UpdateUserSchema } from '../_schemas/update-user.schema';
import { uploadProfilePhotoFile } from '../_utils/upload-profile-photo';

export const GET = routeHandler(async (_, { params }) => {

	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const userData = await findUserById(user_id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	userData.photo = await renewFileExpiration(userData.photo);

	return NextResponse.json(userData);
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});

export const DELETE = routeHandler(async (_, { params }) => {
	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const userData = await findUserById(user_id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (userData.role === 'owner') {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const photoFileObject = userData.photo ? await findFileById(userData.photo.id) : null;

	if (photoFileObject) {
		await deleteFileFromKey(photoFileObject.key);
		await deleteFileById(photoFileObject.id);
	}

	await deleteUserById(userData.id);

	return NextResponse.json({ message: 'User deleted.' });
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});

export const PUT = routeHandler(async (request, { params, currentUser }) => {

	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const formData = await request.formData();
	const body = Object.fromEntries(formData.entries());

	const { avatar, email, ...values } = UpdateUserSchema.parse(body);

	const existingUser = email ? await findUserByEmail(email) : null;
	
	if (existingUser && existingUser.id !== user_id) {
		throw buildApiError({
			code: ApiErrorCode.USER_ALREADY_EXISTS,
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const userData = await findUserById(user_id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (currentUser.role !== 'owner' && userData.role === 'owner') {
		throw buildApiError({
			code: ApiErrorCode.USER_UNEDITABLE,
			status: StatusCode.FORBIDDEN,
		});
	}

	const photoFileData = typeof avatar !== 'string' ? await uploadProfilePhotoFile(currentUser, avatar, userData) : null;
	
	const updatedUser = await updateUser({
		id: user_id,
		...values,
		email: email || userData.email,
		photo: photoFileData?.id || userData.photo?.id || null,
		updated_by: currentUser.id,
	});

	return NextResponse.json(updatedUser);
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});