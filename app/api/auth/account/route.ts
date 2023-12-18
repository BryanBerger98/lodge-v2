import { NextResponse } from 'next/server';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import { findUserById, updateUser } from '@/database/user/user.repository';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';

import { UpdateUserAccountSchema } from './_schemas/update-user-account.schema';

export const GET = routeHandler(async (_, { currentUser }) => {
	const userData = await findUserById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	userData.photo = await renewFileExpiration(userData.photo);

	return NextResponse.json(userData);
}, { authGuard: true });

export const PUT = routeHandler(async (request, { currentUser }) => {
	const body = await request.json();

	const values = UpdateUserAccountSchema.parse(body);

	const updatedUser = await updateUser({
		id: currentUser.id,
		updated_by: currentUser.id,
		...values,
	});

	return NextResponse.json(updatedUser);
}, { authGuard: true });