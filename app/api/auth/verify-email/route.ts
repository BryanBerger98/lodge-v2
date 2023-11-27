import { NextResponse } from 'next/server';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken, verifyToken } from '@/lib/jwt';
import { SettingName } from '@/schemas/setting';
import { IToken, TokenAction } from '@/schemas/token.schema';
import { Optional } from '@/types/utils';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';
import { sendAccountVerificationEmail } from '@/utils/email';

export const GET = routeHandler(async () => {

	await connectToDatabase();

	const userVerifyEmailSetting = await findSettingByName(SettingName.USER_VERIFY_EMAIL);

	if (userVerifyEmailSetting && !userVerifyEmailSetting.value) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const { user: currentUser } = await setServerAuthGuard();

	const userData = await findUserById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (userData.has_email_verified) {
		throw buildApiError({
			code: ApiErrorCode.EMAIL_ALREADY_VERIFIED,
			status: StatusCode.CONFLICT,
		});
	}

	const tokenData = await getTokenFromTargetId(userData.id, {
		action: TokenAction.EMAIL_VERIFICATION,
		created_by: userData.id, 
	});

	if (!tokenData) {
		throw buildApiError({
			code: ApiErrorCode.TOKEN_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const safeTokenData: Optional<IToken, 'token'> = tokenData;
	delete safeTokenData.token;

	return NextResponse.json(safeTokenData);
});

export const POST = routeHandler(async () => {
	await connectToDatabase();

	const userVerifyEmailSetting = await findSettingByName(SettingName.USER_VERIFY_EMAIL);

	if (userVerifyEmailSetting && !userVerifyEmailSetting.value) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

	const { user: currentUser } = await setServerAuthGuard();

	const userData = await findUserById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (userData.has_email_verified) {
		throw buildApiError({
			code: ApiErrorCode.EMAIL_ALREADY_VERIFIED,
			status: StatusCode.CONFLICT,
		});
	}

	const oldToken = await getTokenFromTargetId(userData.id, {
		action: TokenAction.EMAIL_VERIFICATION,
		created_by: userData.id, 
	});

	if (oldToken) {
		const tokenCreationTimestamp = oldToken.created_at.getTime();
		const now = Date.now();
		const timeDiff = Math.round((now - tokenCreationTimestamp) / 1000);
		if (timeDiff < 60) {
			throw buildApiError({
				code: ApiErrorCode.TOKEN_ALREADY_SENT,
				message: 'Wait a minute before sending a new verification email',
				status: StatusCode.FORBIDDEN,
			});
		}
		await deleteTokenById(oldToken.id);
	}

	const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
	const token = generateToken(userData, expirationDate, TokenAction.EMAIL_VERIFICATION);
	const savedToken = await createToken({
		token,
		expiration_date: new Date(expirationDate),
		action: TokenAction.EMAIL_VERIFICATION,
		created_by: currentUser.id,
		target_id: currentUser.id,
	});

	await sendAccountVerificationEmail(userData, savedToken);

	const safeTokenData: Optional<IToken, 'token'> = savedToken;
	delete safeTokenData.token;

	return NextResponse.json(safeTokenData);
});

export const PUT = routeHandler(async (request) => {
	await connectToDatabase();

	const { token } = await request.json();

	if (!token) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_TOKEN,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	const { user: currentUser } = await setServerAuthGuard();

	const savedToken = await getTokenFromTokenString(token);

	if (!savedToken) {
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
	const userData = await findUserByEmail(tokenPayload.email);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	await deleteTokenById(savedToken.id);

	if (typeof userData.id === 'string' && userData.id !== currentUser.id || typeof userData.id !== 'string' && userData.id !== currentUser.id) {
		if (!userData) {
			throw buildApiError({
				code: ApiErrorCode.INVALID_TOKEN,
				status: StatusCode.UNAUTHORIZED,
			});
		}
	}

	if (userData.has_email_verified) {
		if (!userData) {
			throw buildApiError({
				code: ApiErrorCode.EMAIL_ALREADY_VERIFIED,
				status: StatusCode.CONFLICT,
			});
		}
	}

	const updatedUser = await updateUser({
		id: userData.id,
		has_email_verified: true,
		updated_by: currentUser.id,
	});

	return NextResponse.json(updatedUser);
});