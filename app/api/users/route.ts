import { NextResponse } from 'next/server';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import { createUser, findUserByEmail, findUsers, findUsersCount } from '@/database/user/user.repository';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { Role } from '@/schemas/role.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { ReasonPhrase, StatusCode } from '@/utils/api/http-status';
import { isFileURLExpired } from '@/utils/file.util';
import { generatePassword, hashPassword } from '@/utils/password.util';

import { CreateUserSchema } from './_schemas/create-user.schema';
import { FetchUsersSchema } from './_schemas/fetch-users.schema';
import { uploadProfilePhotoFile } from './_utils/upload-profile-photo';

export const POST = routeHandler(async (request, { currentUser }) => {

	const formData = await request.formData();
	const body = Object.fromEntries(formData.entries());

	const { avatar, email, ...values } = CreateUserSchema.parse(body);

	const password = generatePassword(12);
	const existingUser = await findUserByEmail(email);
	
	if (existingUser) {
		throw buildApiError({
			code: ApiErrorCode.USER_ALREADY_EXISTS,
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const hashedPassword = await hashPassword(password);

	const photoFileData = avatar instanceof File ? await uploadProfilePhotoFile(currentUser, avatar) : null;
	
	const createdUser = await createUser({
		...values,
		email,
		password: hashedPassword,
		has_password: true,
		provider_data: AuthenticationProvider.EMAIL,
		created_by: currentUser.id,
		photo: photoFileData?.id || null,
	});
		
	return NextResponse.json(createdUser, {
		status: StatusCode.CREATED,
		statusText: ReasonPhrase.CREATED, 
	});
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});

export const GET = routeHandler(async (_, { searchParams }) => {

	const { sort_fields, sort_directions, page_index, page_size, search, roles } = FetchUsersSchema.parse(searchParams);

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
		await Promise.all(expiredFiles.map(async (file) => await renewFileExpiration(file)));
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
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});

