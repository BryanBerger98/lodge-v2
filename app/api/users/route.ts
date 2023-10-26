import { parse } from 'url';

import { NextRequest, NextResponse } from 'next/server';

import { createFile, deleteFileById, findFileById, updateFileURL } from '@/database/file/file.repository';
import { createUser, findUserByEmail, findUserById, findUsers, findUsersCount, updateUser } from '@/database/user/user.repository';
import { deleteFileFromKey, getFieldSignedURL, uploadImageToS3 } from '@/lib/bucket';
import { connectToDatabase } from '@/lib/database';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { ImageMimeTypeSchema } from '@/schemas/file/mime-type.schema';
import { Role } from '@/schemas/role.schema';
import { UserPopulated, User } from '@/schemas/user';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendBuiltErrorWithSchemaValidation } from '@/utils/error';
import { FILE_TOO_LARGE_ERROR, USER_ALREADY_EXISTS_ERROR, USER_NOT_FOUND_ERROR, USER_UNEDITABLE_ERROR, WRONG_FILE_FORMAT_ERROR } from '@/utils/error/error-codes';
import { AUTHORIZED_IMAGE_MIME_TYPES, AUTHORIZED_IMAGE_SIZE, convertFileRequestObjetToModel, isFileURLExpired } from '@/utils/file.util';
import { generatePassword, hashPassword } from '@/utils/password.util';

import { CreateUserSchema } from './_schemas/create-user.schema';
import { FetchUsersSchema } from './_schemas/fetch-users.schema';
import { UpdateUserSchema } from './_schemas/update-user.schema';

const uploadPhotoFile = async (currentUser: UserPopulated, photoFile?: Blob | null, user?: User | UserPopulated) => {
	try {
		if (photoFile) {
			const fileMimeType = ImageMimeTypeSchema.parse(photoFile.type);
			if (!AUTHORIZED_IMAGE_MIME_TYPES.includes(fileMimeType)) {
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
	
			if (user && user.photo) {
				const oldFile = await findFileById(typeof user.photo === 'string' ? user.photo : user.photo.id);
				if (oldFile) {
					await deleteFileFromKey(oldFile.key);
					await deleteFileById(oldFile.id);
				}
			}

			const photoKey = await uploadImageToS3(photoFile, 'avatars/');
			const photoUrl = await getFieldSignedURL(photoKey, 24 * 60 * 60);

			const parsedFile = {
				...convertFileRequestObjetToModel(photoFile, {
					url: photoUrl,
					key: photoKey,
				}),
				created_by: currentUser.id,
			};
	
			const savedFile = await createFile(parsedFile);
	
			return savedFile;
		}
		return null;
	} catch (error) {
		throw error;
	}
};

export const POST = async (request: NextRequest) => {

	try {

		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

		const formData = await request.formData();

		const file = formData.get('avatar') as Blob | null;
		formData.delete('avatar');
		const body = Object.fromEntries(formData.entries());

		const { email, username, phone_number, is_disabled, role } = CreateUserSchema.parse(body);

		const password = generatePassword(12);
		const existingUser = await findUserByEmail(email);
	
		if (existingUser) {
			throw buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			});
		}

		const hashedPassword = await hashPassword(password);

		const photoFileData = await uploadPhotoFile(currentUser, file);
	
		const createdUser = await createUser({
			email,
			password: hashedPassword,
			username,
			role,
			phone_number,
			provider_data: AuthenticationProvider.EMAIL,
			created_by: currentUser.id,
			photo: photoFileData?.id || null,
			is_disabled,
		});
		
		return NextResponse.json(createdUser);
	} catch (error: any) {
		console.error(error);
		return sendBuiltErrorWithSchemaValidation(error);
	}
};

export const PUT = async (request: NextRequest) => {

	try {

		await connectToDatabase();

		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

		const formData = await request.formData();

		const file = formData.get('avatar') as Blob | null;
		formData.delete('avatar');
		const body = Object.fromEntries(formData.entries());

		const { email, username, phone_number, is_disabled, role, id } = UpdateUserSchema.parse(body);

		const existingUser = email ? await findUserByEmail(email) : null;
	
		if (existingUser && existingUser.id.toString() !== id) {
			throw buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			});
		}

		const userData = await findUserById(id);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		if (currentUser.role !== 'owner' && userData.role === 'owner') {
			throw buildError({
				code: USER_UNEDITABLE_ERROR,
				message: 'This user is not editable',
				status: 403,
			});
		}

		const photoFileData = await uploadPhotoFile(currentUser, file, userData);
	
		const updatedUser = await updateUser({
			id,
			email: email || userData.email,
			username: username || userData.username || undefined,
			role: role || userData.role,
			phone_number: phone_number || userData.phone_number,
			is_disabled: is_disabled !== undefined && is_disabled !== null ? is_disabled : userData.is_disabled,
			photo: photoFileData?.id || userData.photo?.id || null,
			updated_by: currentUser.id,
		});
		
		return NextResponse.json(updatedUser);
	} catch (error: any) {
		console.error(error);
		return sendBuiltErrorWithSchemaValidation(error);
	}
};

export const GET = async (request: NextRequest) => {
	try {

		await connectToDatabase();

		await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

		const queryParams = parse(request.url, true).query;

		const { sort_fields, sort_directions, page_index, page_size, search, roles } = FetchUsersSchema.parse(queryParams);

		const searchArray = search ? search.trim().split(' ') : [];
		const searchRegexArray = searchArray.map(string => new RegExp(string, 'i'));
		const searchRequest = searchRegexArray.length > 0 ? { $or: [ { username: { $in: searchRegexArray } }, { email: { $in: searchRegexArray } } ] } : {};

		const rolesRequest = { role: { $in: roles } };

		let users = await findUsers({
			...rolesRequest,
			...searchRequest, 
		}, {
			sort: Object.fromEntries(sort_fields.map((field, index) => [ field, sort_directions[ index ] as 1 | -1 ])),
			skip: Math.round(page_index * page_size),
			limit: page_size,
		});

		const expiredFiles = isFileURLExpired(...users.map(user => user.photo));

		if (expiredFiles.length > 0) {
			await Promise.all(expiredFiles.map(async (file) => {
				const photoUrl = await getFieldSignedURL(file.key, 24 * 60 * 60);
				await updateFileURL({
					id: file.id,
					url: photoUrl,
				});
			}));
			users = await findUsers({
				...rolesRequest,
				...searchRequest, 
			}, {
				sort: Object.fromEntries(sort_fields.map((field, index) => [ field, sort_directions[ index ] as 1 | -1 ])),
				skip: Math.round(page_index * page_size),
				limit: page_size,
			});
		}

		const count = users.length;
		const total = await findUsersCount(searchRequest);

		return NextResponse.json({
			users,
			count,
			total,
		});

	} catch (error: any) {
		console.error(error);
		return sendBuiltErrorWithSchemaValidation(error);
	}
};

