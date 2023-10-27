import { NextResponse } from 'next/server';

import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { ImageMimeTypeSchema } from '@/schemas/file/mime-type.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

export const GET = routeHandler(async () => {

	const { user: currentUser } = await setServerAuthGuard();

	const currentUserData = await findUserById(currentUser.id);

	if (!currentUserData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const photoFileObject = currentUserData.photo ? await findFileById(currentUserData.photo.id) : null;

	if (!photoFileObject) {
		throw buildApiError({
			code: ApiErrorCode.FILE_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const photoUrl = await getFieldSignedURL(photoFileObject.key, 24 * 60 * 60);

	return NextResponse.json({ photo_url: photoUrl });
});

export const PUT = routeHandler(async (request) => {
	const formData = await request.formData();
	const file = formData.get('avatar') as Blob | null;

	if (!file) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'File is required.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const fileMimeType = ImageMimeTypeSchema.parse(file.type);
	if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(fileMimeType)) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_FILE_FORMAT,
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	if (file.size > AUTHORIZED_IMAGE_SIZE) {
		throw buildApiError({
			code: ApiErrorCode.FILE_TOO_LARGE,
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const { user: currentUser } = await setServerAuthGuard();

	const currentUserData = await findUserById(currentUser.id);

	if (!currentUserData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (currentUserData.photo) {
		const oldFile = await findFileById(currentUserData.photo.id);
		if (oldFile) {
			await deleteFileFromKey(oldFile.key);
			await deleteFileById(oldFile.id);
		}
	}

	const photoKey = await uploadImageToS3(file, 'avatars/');

	const photoUrl = await getFieldSignedURL(photoKey, 24 * 60 * 60);
	

	const parsedFile = {
		...convertFileRequestObjetToModel(file, {
			key: photoKey,
			url: photoUrl,
		}),
		created_by: currentUser.id,
	};

	const savedFile = await createFile(parsedFile);

	const updatedCurrentUser = await updateUser({
		id: currentUser.id,
		photo: savedFile?.id,
		updated_by: currentUser.id,
	}, { newDocument: true });

	return NextResponse.json(updatedCurrentUser);
});