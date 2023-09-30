import { NextResponse, type NextRequest } from 'next/server';

import { createFile, deleteFileById, findFileById } from '@/database/file/file.repository';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltError } from '@/utils/error';
import { FILE_NOT_FOUND_ERROR, FILE_TOO_LARGE_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

export const GET = async () => {

	try {
		const { user: currentUser } = await setServerAuthGuard();

		const currentUserData = await findUserById(currentUser.id);

		if (!currentUserData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		const photoFileObject = currentUserData.photo ? await findFileById(currentUserData.photo.id) : null;

		if (!photoFileObject) {
			throw buildError({
				code: FILE_NOT_FOUND_ERROR,
				message: 'File not found.',
				status: 404,
			});
		}

		const photoUrl = await getFieldSignedURL(photoFileObject.key, 24 * 60 * 60);

		return NextResponse.json({ photo_url: photoUrl });
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}
};

export const PUT = async (request: NextRequest) => {

	try {

		const formData = await request.formData();
		const file = formData.get('avatar') as Blob | null;

		if (!file) {
			throw buildError({
				code: INVALID_INPUT_ERROR,
				message: 'No file provided.',
				status: 422,
			});
		}

		if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(file.type)) {
			throw buildError({
				code: WRONG_FILE_FORMAT_ERROR,
				message: 'Wrong file format.',
				status: 422,
			});
		}

		if (file.size > AUTHORIZED_IMAGE_SIZE) {
			throw buildError({
				code: FILE_TOO_LARGE_ERROR,
				message: 'The file is too large.',
				status: 422,
			});
		}

		const { user: currentUser } = await setServerAuthGuard();

		const currentUserData = await findUserById(currentUser.id);

		if (!currentUserData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
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
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}
};