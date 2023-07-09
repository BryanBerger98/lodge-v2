import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { createFile, deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { CreateUserSchema } from '@/database/user/user.dto';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { deleteFileFromKey, getFileFromKey, uploadImageToS3 } from '@/lib/bucket';
import { IUser } from '@/types/user.type';
import { buildError, sendError } from '@/utils/error';
import { FILE_TOO_LARGE_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, UNAUTHORIZED_ERROR, USER_ALREADY_EXISTS_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';
import { generatePassword, hashPassword } from '@/utils/password.util';

import { authOptions } from '../auth/[...nextauth]/route';

const uploadPhotoFile = async (currentUser: IUser, photoFile?: Blob | null, user?: IUser) => {
	try {
		const fileData: { photo_url: string | null, photo_key: string | null } = {
			photo_url: null,
			photo_key: null,
		};
		if (photoFile) {
			if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(photoFile.type)) {
				throw buildError({
					code: WRONG_FILE_FORMAT_ERROR,
					message: 'Wrong file format.',
					status: 422,
				});
			}
	
			if (photoFile.size > AUTHORIZED_IMAGE_SIZE) {
				throw buildError({
					code: FILE_TOO_LARGE_ERROR,
					message: 'The file is too large.',
					status: 422,
				});
			}
	
			if (user && user.photo_key && user.photo_key !== '') {
				const oldFile = await findFileByKey(user.photo_key);
				if (oldFile) {
					await deleteFileFromKey(oldFile.key);
					await deleteFileById(oldFile.id);
				}
			}
	
			const photoKey = await uploadImageToS3(photoFile, 'avatars/');
		
	
			const parsedFile = {
				...convertFileRequestObjetToModel(photoFile, photoKey),
				created_by: currentUser.id,
			};
	
			const savedFile = await createFile(parsedFile);
	
			const photoUrl = savedFile ? await getFileFromKey(savedFile) : null;
			fileData.photo_key = savedFile?.key || null,
			fileData.photo_url = photoUrl;
		}
		return fileData;
	} catch (error) {
		throw error;
	}
};

export const POST = async (request: NextRequest) => {

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

		const formData = await request.formData();

		const file = formData.get('avatar') as Blob | null;
		formData.delete('avatar');
		const body = Object.fromEntries(formData.entries());

		const { email, username, phone_number, is_disabled, role } = CreateUserSchema.parse(body);

		const password = generatePassword(12);
		const existingUser = await findUserByEmail(email);
	
		if (existingUser) {
			return sendError(buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			}));
		}

		const hashedPassword = await hashPassword(password);

		const photoFileData = await uploadPhotoFile(currentUser, file);
	
		const createdUser = await createUser({
			email,
			password: hashedPassword,
			username,
			role,
			phone_number,
			provider_data: 'email',
			created_by: currentUser.id,
			photo_key: photoFileData.photo_key,
			is_disabled,
		});

		if (createdUser) {
			createdUser.photo_url = photoFileData.photo_url;
		}
		
		return NextResponse.json(createdUser);
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