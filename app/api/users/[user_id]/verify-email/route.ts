import { NextResponse } from 'next/server';

import { createToken, deleteTokenById, getTokenFromTargetId } from '@/database/token/token.repository';
import { findUserById } from '@/database/user/user.repository';
import { generateToken } from '@/lib/jwt';
import { Role } from '@/schemas/role.schema';
import { IToken, TokenAction } from '@/schemas/token.schema';
import { Optional } from '@/types/utils';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { sendAccountVerificationEmail } from '@/utils/email';

export const POST = routeHandler(async (_, { params, currentUser }) => {

	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const userData = await findUserById(user_id);

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

	const oldToken = await getTokenFromTargetId(userData.id, { action: TokenAction.EMAIL_VERIFICATION });

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
		target_id: userData.id,
	});

	await sendAccountVerificationEmail(userData, savedToken);

	const safeTokenData: Optional<IToken, 'token'> = savedToken;
	delete safeTokenData.token;

	return NextResponse.json(safeTokenData);
}, {
	authGuard: true,
	rolesWhiteList: [ Role.OWNER, Role.ADMIN ],
});