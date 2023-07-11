import { NextResponse, type NextRequest } from 'next/server';

import { createFile, deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey, getFileFromKey, uploadImageToS3 } from '@/lib/bucket';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { FILE_NOT_FOUND_ERROR, FILE_TOO_LARGE_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';

export const GET = async () => {

	try {
		const { user: currentUser } = await setServerAuthGuard();

		const currentUserData = await findUserById(currentUser.id);

		if (!currentUserData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		const photoFileObject = currentUserData.photo_key ? await findFileByKey(currentUserData.photo_key) : null;

		if (!photoFileObject) {
			return sendError(buildError({
				code: FILE_NOT_FOUND_ERROR,
				message: 'File not found.',
				status: 404,
			}));
		}

		const photoUrl = await getFileFromKey(photoFileObject);

		return NextResponse.json({ photo_url: photoUrl });
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

		const formData = await request.formData();
		const file = formData.get('avatar') as Blob | null;

		if (!file) {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'No file provided.',
				status: 422,
			}));
		}

		if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(file.type)) {
			return sendError(buildError({
				code: WRONG_FILE_FORMAT_ERROR,
				message: 'Wrong file format.',
				status: 422,
			}));
		}

		if (file.size > AUTHORIZED_IMAGE_SIZE) {
			return sendError(buildError({
				code: FILE_TOO_LARGE_ERROR,
				message: 'The file is too large.',
				status: 422,
			}));
		}

		const { user: currentUser } = await setServerAuthGuard();

		const currentUserData = await findUserById(currentUser.id);

		if (!currentUserData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (currentUserData.photo_key && currentUserData.photo_key !== '') {
			const oldFile = await findFileByKey(currentUserData.photo_key);
			if (oldFile) {
				await deleteFileFromKey(oldFile.key);
				await deleteFileById(oldFile.id);
			}
		}

		const photoKey = await uploadImageToS3(file, 'avatars/');
	

		const parsedFile = {
			...convertFileRequestObjetToModel(file, photoKey),
			created_by: currentUser.id,
		};

		const savedFile = await createFile(parsedFile);

		const updatedCurrentUser = await updateUser({
			id: currentUser.id,
			photo_key: parsedFile.key,
			updated_by: currentUser.id,
		}, { newDocument: true });

		const photoUrl = savedFile ? await getFileFromKey(savedFile) : null;

		if (updatedCurrentUser) {
			updatedCurrentUser.photo_url = photoUrl;
		}

		return NextResponse.json(updatedCurrentUser);
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