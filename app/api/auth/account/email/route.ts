import { NextResponse } from 'next/server';

import { findUserWithPasswordById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';
import { verifyPassword } from '@/utils/password.util';

import { UpdateUserEmailSchema } from './_schemas/update-user-email.schema';


export const PUT = routeHandler(async (request) => {

	await connectToDatabase();

	const body = await request.json();

	const { email, password } = UpdateUserEmailSchema.parse(body);

	const { user: currentUser } = await setServerAuthGuard();

	const user = await findUserWithPasswordById(currentUser.id);

	if (!user) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (!user.password) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_AUTH_METHOD,
			status: StatusCode.CONFLICT,
		});
	}

	const isPasswordValid = await verifyPassword(password, user.password);

	if (!isPasswordValid) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_PASSWORD,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	const updatedUser = await updateUser({
		id: currentUser.id,
		email,
		has_email_verified: false,
		updated_by: currentUser.id,
	}, { newDocument: true });

	return NextResponse.json(updatedUser);
});