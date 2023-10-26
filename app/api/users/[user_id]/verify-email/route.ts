import { NextResponse } from 'next/server';

import { createToken, deleteTokenById, getTokenFromTargetId } from '@/database/token/token.repository';
import { findUserById } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { Role } from '@/schemas/role.schema';
import { Token, TokenAction } from '@/schemas/token.schema';
import { Optional } from '@/types/utils';
import { setServerAuthGuard } from '@/utils/auth';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error';
import { EMAIL_ALREADY_VERIFIED_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, TOKEN_ALREADY_SENT_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

export const POST = async (_: any, { params }: { params: { user_id: string } }) => {
	try {
		
		const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });

		await connectToDatabase();

		const { user_id } = params;

		if (!user_id) {
			return sendError(buildError({
				code: INVALID_INPUT_ERROR,
				message: 'User id is missing.',
				status: 422,
			}));
		}

		const userData = await findUserById(user_id);

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
			target_id: userData.id,
		});

		await sendAccountVerificationEmail(userData, savedToken);

		const safeTokenData: Optional<Token, 'token'> = savedToken;
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