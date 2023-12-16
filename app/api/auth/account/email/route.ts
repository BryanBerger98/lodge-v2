import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, findUserWithPasswordById, updateUser } from '@/database/user/user.repository';
import { generateToken, verifyToken } from '@/lib/jwt';
import { TokenAction } from '@/schemas/token.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { sendNewEmailConfirmationEmail } from '@/utils/email';
import { verifyPassword } from '@/utils/password.util';

import { UpdateUserEmailSchema } from './_schemas/update-user-email.schema';

export const POST = routeHandler(async (request, { currentUser }) => {

	const body = await request.json();
	const { email, password } = UpdateUserEmailSchema.parse(body);

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

	if (user.email === email) {
		throw buildApiError({ status: StatusCode.CONFLICT });
	}

	const existingUser = await findUserByEmail(email);

	if (existingUser && existingUser.email === email) {
		throw buildApiError({
			code: ApiErrorCode.USER_ALREADY_EXISTS,
			status: StatusCode.CONFLICT,
		});
	};

	const isPasswordValid = await verifyPassword(password, user.password);

	if (!isPasswordValid) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_PASSWORD,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	if (user.new_email === email) {
		throw buildApiError({ status: StatusCode.CONFLICT });
	}

	const oldToken = await getTokenFromTargetId(user.id, {
		action: TokenAction.NEW_EMAIL_CONFIRMATION,
		created_by: user.id, 
	});

	if (oldToken) {
		const tokenCreationTimestamp = oldToken.created_at.getTime();
		const now = Date.now();
		const timeDiff = Math.round((now - tokenCreationTimestamp) / 1000);
		if (timeDiff < 60) {
			throw buildApiError({
				code: ApiErrorCode.TOKEN_ALREADY_SENT,
				message: 'Wait a minute before sending a new rest password email',
				status: StatusCode.FORBIDDEN,
			});
		}
		await deleteTokenById(oldToken.id);
	}

	const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
	const token = generateToken(user, expirationDate, TokenAction.NEW_EMAIL_CONFIRMATION);
	const savedToken = await createToken({
		token,
		expiration_date: new Date(expirationDate),
		action: TokenAction.RESET_PASSWORD,
		created_by: user.id,
		target_id: user.id,
	});

	const updatedUser = await updateUser({
		id: currentUser.id,
		new_email: email,
		updated_by: currentUser.id,
	});

	if (!updatedUser) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	await sendNewEmailConfirmationEmail(updatedUser, savedToken);

	return NextResponse.json(updatedUser);
}, { authGuard: true });

export const PUT = routeHandler(async (request, { currentUser }) => {

	const confirmUpdateEmailSchema = z.object({ token: z.coerce.string().min(1, 'Required.') });

	const body = await request.json();
	const { token } = confirmUpdateEmailSchema.parse(body);

	const savedToken = await getTokenFromTokenString(token);

	if (!savedToken?.created_by) {
		throw buildApiError({
			code: ApiErrorCode.TOKEN_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const tokenPayload = verifyToken(savedToken.token);
	if (typeof tokenPayload === 'string') {
		throw buildApiError({
			code: ApiErrorCode.INVALID_TOKEN,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	const userData = await findUserById(savedToken.target_id);

	if (!userData || (userData.id !== currentUser.id)) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (!userData.new_email) {
		throw buildApiError({ status: StatusCode.CONFLICT });
	}

	await deleteTokenById(savedToken.id);

	const updatedUser = await updateUser({
		id: currentUser.id,
		new_email: null,
		email: userData.new_email,
		has_email_verified: true,
		updated_by: currentUser.id,
	});

	return NextResponse.json(updatedUser);
}, { authGuard: true });