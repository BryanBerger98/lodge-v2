import { NextRequest, NextResponse } from 'next/server';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken, verifyToken } from '@/lib/jwt';
import { TokenAction } from '@/schemas/token.schema';
import { IToken } from '@/types/token.type';
import { Optional } from '@/types/utils';
import { setServerAuthGuard } from '@/utils/auth';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendBuiltError, sendError } from '@/utils/error';
import { EMAIL_ALREADY_VERIFIED_ERROR, FORBIDDEN_ERROR, INVALID_TOKEN_ERROR, TOKEN_ALREADY_SENT_ERROR, TOKEN_EXPIRED_ERROR, TOKEN_NOT_FOUND_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { SETTING_NAMES } from '@/utils/settings';

export const GET = async () => {

	try {
		await connectToDatabase();

		const userVerifyEmailSetting = await findSettingByName(SETTING_NAMES.USER_VERIFY_EMAIL_SETTING);

		if (userVerifyEmailSetting && userVerifyEmailSetting.data_type === 'boolean' && !userVerifyEmailSetting.value) {
			throw buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			});
		}

		const { user: currentUser } = await setServerAuthGuard();

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		if (userData.has_email_verified) {
			throw buildError({
				code: EMAIL_ALREADY_VERIFIED_ERROR,
				message: 'Email already verified.',
				status: 500,
			});
		}

		const tokenData = await getTokenFromTargetId(userData.id, { action: TokenAction.EMAIL_VERIFICATION });

		if (!tokenData) {
			throw buildError({
				code: TOKEN_NOT_FOUND_ERROR,
				message: 'Token not found.',
				status: 404,
			});
		}

		const safeTokenData: Optional<IToken, 'token'> = tokenData;
		delete safeTokenData.token;

		return NextResponse.json(safeTokenData);
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}

};

export const POST = async () => {

	try {
		await connectToDatabase();

		const userVerifyEmailSetting = await findSettingByName(SETTING_NAMES.USER_VERIFY_EMAIL_SETTING);

		if (userVerifyEmailSetting && userVerifyEmailSetting.data_type === 'boolean' && !userVerifyEmailSetting.value) {
			throw buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			});
		}

		const { user: currentUser } = await setServerAuthGuard();

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		if (userData.has_email_verified) {
			throw buildError({
				code: EMAIL_ALREADY_VERIFIED_ERROR,
				message: 'Email already verified.',
				status: 500,
			});
		}

		const oldToken = await getTokenFromTargetId(userData.id, { action: TokenAction.EMAIL_VERIFICATION });

		if (oldToken) {
			const tokenCreationTimestamp = oldToken.created_at.getTime();
			const now = Date.now();
			const timeDiff = Math.round((now - tokenCreationTimestamp) / 1000);
			if (timeDiff < 60) {
				return sendError(buildError({
					code: TOKEN_ALREADY_SENT_ERROR,
					message: 'Wait a minute before sending a new verification email',
					status: 403,
				}));
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
	} catch (error: any) {
		console.error(error);
		return sendBuiltError(error);
	}
};

export const PUT = async (request: NextRequest) => {

	try {
		await connectToDatabase();

		const { token } = await request.json();

		if (!token) {
			throw buildError({
				code: INVALID_TOKEN_ERROR,
				message: 'Invalid token.',
				status: 401,
			});
		}

		const { user: currentUser } = await setServerAuthGuard();

		const savedToken = await getTokenFromTokenString(token);

		if (!savedToken) {
			throw buildError({
				code: TOKEN_NOT_FOUND_ERROR,
				message: 'Token not found.',
				status: 404,
			});
		}

		const tokenPayload = verifyToken(savedToken.token);
		if (typeof tokenPayload === 'string') {
			throw buildError({
				code: INVALID_TOKEN_ERROR,
				message: 'Invalid token.',
				status: 401,
			}); 
		}
		const userData = await findUserByEmail(tokenPayload.email);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		await deleteTokenById(savedToken.id);

		if (typeof userData.id === 'string' && userData.id !== currentUser.id || typeof userData.id !== 'string' && userData.id !== currentUser.id) {
			if (!userData) {
				throw buildError({
					code: INVALID_TOKEN_ERROR,
					message: 'Invalid token.',
					status: 401,
				});
			}
		}

		if (userData.has_email_verified) {
			if (!userData) {
				throw buildError({
					code: EMAIL_ALREADY_VERIFIED_ERROR,
					message: 'Email already verified.',
					status: 500,
				});
			}
		}

		const updatedUser = await updateUser({
			id: userData.id,
			has_email_verified: true,
			updated_by: currentUser.id,
		}, { newDocument: true });

		return NextResponse.json(updatedUser);
	} catch (error: any) {
		console.error(error);
		if (error.name && error.name === 'TokenExpiredError') {
			return sendError(buildError({
				code: TOKEN_EXPIRED_ERROR,
				message: 'Token expired',
				status: 500,
				data: error,
			}));
		}
		return sendBuiltError(error);
	}
};