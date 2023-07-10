import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/config/database.config';
import { createToken, deleteTokenById, getTokenFromCreatedBy, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUser } from '@/database/user/user.repository';
import { IToken } from '@/types/token.type';
import { Optional } from '@/types/utils.type';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error';
import { EMAIL_ALREADY_VERIFIED_ERROR, INTERNAL_ERROR, INVALID_TOKEN_ERROR, TOKEN_ALREADY_SENT_ERROR, TOKEN_EXPIRED_ERROR, TOKEN_NOT_FOUND_ERROR, UNAUTHORIZED_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { generateToken, verifyToken } from '@/utils/token.util';

import { authOptions } from '../[...nextauth]/route';

export const GET = async () => {

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

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (userData.has_email_verified) {
			return sendError(buildError({
				code: EMAIL_ALREADY_VERIFIED_ERROR,
				message: 'Email already verified.',
				status: 500,
			}));
		}

		const tokenData = await getTokenFromCreatedBy(userData.id, { action: 'email_verification' });

		if (!tokenData) {
			return sendError(buildError({
				code: TOKEN_NOT_FOUND_ERROR,
				message: 'Token not found.',
				status: 404,
			}));
		}

		const safeTokenData: Optional<IToken, 'token'> = tokenData;
		delete safeTokenData.token;

		return NextResponse.json(safeTokenData);
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

export const POST = async () => {

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

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		if (userData.has_email_verified) {
			return sendError(buildError({
				code: EMAIL_ALREADY_VERIFIED_ERROR,
				message: 'Email already verified.',
				status: 500,
			}));
		}

		const oldToken = await getTokenFromCreatedBy(userData.id, { action: 'email_verification' });

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
		const token = generateToken(userData, expirationDate, 'email_verification');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'email_verification',
			created_by: currentUser.id,
		});

		await sendAccountVerificationEmail(userData, savedToken);

		const safeTokenData: Optional<IToken, 'token'> = savedToken;
		delete safeTokenData.token;

		return NextResponse.json(safeTokenData);
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
		await connectToDatabase();

		const { token } = await request.json();

		if (!token) {
			return sendError(buildError({
				code: INVALID_TOKEN_ERROR,
				message: 'Invalid token.',
				status: 401,
			}));
		}

		const session = await getServerSession(authOptions);
		const currentUser = session?.user;

		if (!currentUser) {
			return sendError(buildError({
				code: UNAUTHORIZED_ERROR,
				message: 'Unauthorized.',
				status: 401,
			}));
		}

		const savedToken = await getTokenFromTokenString(token);

		if (!savedToken) {
			return sendError(buildError({
				code: TOKEN_NOT_FOUND_ERROR,
				message: 'Token not found.',
				status: 404,
			}));
		}

		const tokenPayload = verifyToken(savedToken.token);
		if (typeof tokenPayload === 'string') {
			return sendError(buildError({
				code: INVALID_TOKEN_ERROR,
				message: 'Invalid token.',
				status: 401,
			})); 
		}
		const userData = await findUserByEmail(tokenPayload.email);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		await deleteTokenById(savedToken.id);

		if (typeof userData.id === 'string' && userData.id !== currentUser.id || typeof userData.id !== 'string' && userData.id.toHexString() !== currentUser.id) {
			if (!userData) {
				return sendError(buildError({
					code: INVALID_TOKEN_ERROR,
					message: 'Invalid token.',
					status: 401,
				}));
			}
		}

		if (userData.has_email_verified) {
			if (!userData) {
				return sendError(buildError({
					code: EMAIL_ALREADY_VERIFIED_ERROR,
					message: 'Email already verified.',
					status: 500,
				}));
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
		return sendError(buildError({
			code: INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: 500,
			data: error,
		}));
	}
};