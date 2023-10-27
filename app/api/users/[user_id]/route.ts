import { NextResponse } from 'next/server';

import { deleteFileById, findFileById } from '@/database/file/file.repository';
import { deleteUserById, findUserByEmail, findUserById, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';

import { UpdateUserSchema } from '../_schemas/update-user.schema';
import { uploadProfilePhotoFile } from '../_utils/upload-profile-photo';

export const DELETE = routeHandler(async (_, { params }) => {
	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	await connectToDatabase();

	await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

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
});

export const PUT = routeHandler(async (request, { params }) => {

	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

	const formData = await request.formData();

	const file = formData.get('avatar') as Blob | null;
	formData.delete('avatar');
	const body = Object.fromEntries(formData.entries());

	const { email, username, phone_number, is_disabled, role } = UpdateUserSchema.parse(body);

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

	const photoFileData = await uploadProfilePhotoFile(currentUser, file, userData);
	
	const updatedUser = await updateUser({
		id: user_id,
		email: email || userData.email,
		username: username || userData.username || undefined,
		role: role || userData.role,
		phone_number: phone_number || userData.phone_number,
		is_disabled: is_disabled !== undefined && is_disabled !== null ? is_disabled : userData.is_disabled,
		photo: photoFileData?.id || userData.photo?.id || null,
		updated_by: currentUser.id,
	});
		
	return NextResponse.json(updatedUser);
});