import { parse } from 'url';

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { createFile, deleteFileById, findFileByKey } from '@/database/file/file.repository';
import { CreateUserSchema, FetchUsersSchema, UpdateUserSchema } from '@/database/user/user.dto';
import { createUser, findUserByEmail, findUserById, findUsers, findUsersCount, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey, getFileFromKey, uploadImageToS3 } from '@/lib/bucket';
import { IUser } from '@/types/user.type';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { FILE_TOO_LARGE_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_ALREADY_EXISTS_ERROR, USER_NOT_FOUND_ERROR, USER_UNEDITABLE_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel } from '@/utils/file.util';
import { generatePassword, hashPassword } from '@/utils/password.util';

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

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ 'owner', 'admin' ] });

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

export const PUT = async (request: NextRequest) => {

	try {

		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ 'owner', 'admin' ] });

		const formData = await request.formData();

		const file = formData.get('avatar') as Blob | null;
		formData.delete('avatar');
		const body = Object.fromEntries(formData.entries());

		const { email, username, phone_number, is_disabled, role, id } = UpdateUserSchema.parse(body);

		const existingUser = email ? await findUserByEmail(email) : null;
	
		if (existingUser && existingUser.id.toString() !== id) {
			return sendError(buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			}));
		}

		const userData = await findUserById(id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (currentUser.role !== 'owner' && userData.role === 'owner') {
			return sendError(buildError({
				code: USER_UNEDITABLE_ERROR,
				message: 'This user is not editable',
				status: 403,
			}));
		}

		const photoFileData = await uploadPhotoFile(currentUser, file, userData);
	
		const updatedUser = await updateUser({
			id,
			email: email || userData.email,
			username: username || userData.username,
			role: role || userData.role,
			phone_number: phone_number || userData.phone_number,
			is_disabled: is_disabled !== undefined && is_disabled !== null ? is_disabled : userData.is_disabled,
			photo_key: photoFileData.photo_key || userData.photo_key,
			updated_by: currentUser.id,
		});

		if (updatedUser) {
			updatedUser.photo_url = photoFileData.photo_url;
		}
		
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

export const GET = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ 'owner', 'admin' ] });

		const queryParams = parse(request.url, true).query;

		const { sort_fields, sort_directions, page_index, page_size, search, roles } = FetchUsersSchema.parse(queryParams);

		const searchArray = search ? search.trim().split(' ') : [];
		const searchRegexArray = searchArray.map(string => new RegExp(string, 'i'));
		const searchRequest = searchRegexArray.length > 0 ? { $or: [ { username: { $in: searchRegexArray } }, { email: { $in: searchRegexArray } } ] } : {};

		const rolesRequest = { role: { $in: roles } };

		const users = await findUsers({
			...rolesRequest,
			...searchRequest, 
		}, {
			sort: Object.fromEntries(sort_fields.map((field, index) => [ field, sort_directions[ index ] as 1 | -1 ])),
			skip: Math.round(page_index * page_size),
			limit: page_size,
		});
		const count = users.length;
		const total = await findUsersCount(searchRequest);

		return NextResponse.json({
			users,
			count,
			total,
		});

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

