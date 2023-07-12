import { NextRequest, NextResponse } from 'next/server';
import { ZodError, object, string } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUserPassword } from '@/database/user/user.repository';
import { IToken } from '@/types/token.type';
import { Optional } from '@/types/utils.type';
import { sendResetPasswordEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, INVALID_TOKEN_ERROR, TOKEN_ALREADY_SENT_ERROR, TOKEN_NOT_FOUND_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { hashPassword } from '@/utils/password.util';
import { generateToken, verifyToken } from '@/utils/token.util';

export const POST = async (request: NextRequest) => {

	try {
		await connectToDatabase();

		const emailSchema = object({ email: string().email('Please, provide a valid email address.').min(1, 'Required.') });

		const body = await request.json();

		const { email } = emailSchema.parse(body);

		const userData = await findUserByEmail(email);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		const oldToken = await getTokenFromTargetId(userData.id, { action: 'reset_password' });

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

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
		const token = generateToken(userData, expirationDate, 'reset_password');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'reset_password',
			created_by: userData.id,
			target_id: userData.id,
		});

		await sendResetPasswordEmail(userData, savedToken);

		const safeTokenData: Optional<IToken, 'token'> = savedToken;
		delete safeTokenData.token;

		return NextResponse.json(safeTokenData);
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

		const resetPasswordSchema = object({
			token: string().min(1, 'Required.'),
			password: string().min(8, 'At least 8 characters.'),
		});

		const body = await request.json();
		const { token, password } = resetPasswordSchema.parse(body);

		const savedToken = await getTokenFromTokenString(token);

		if (!savedToken?.created_by) {
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

		const userData = await findUserById(savedToken.target_id);

		if (!userData) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		await deleteTokenById(savedToken.id);

		const hashedPassword = await hashPassword(password);
		await updateUserPassword(userData.id, hashedPassword, userData.id);
		
		return NextResponse.json({ message: 'Updated.' });
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