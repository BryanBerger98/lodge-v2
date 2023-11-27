import { NextResponse } from 'next/server';

import { createToken, deleteTokenById, getTokenFromTargetId } from '@/database/token/token.repository';
import { findUserById } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { Role } from '@/schemas/role.schema';
import { IToken, TokenAction } from '@/schemas/token.schema';
import { Optional } from '@/types/utils';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { setServerAuthGuard } from '@/utils/auth';
import { sendResetPasswordEmail } from '@/utils/email';

export const POST = routeHandler(async (_, { params }) => {
	const { user: currentUser } = await setServerAuthGuard({ rolesWhiteList: [ Role.OWNER, Role.ADMIN ] });
		
	const { user_id } = params;

	if (!user_id) {
		throw buildApiError({
			code: ApiErrorCode.INVALID_INPUT,
			message: 'User id is missing.',
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	await connectToDatabase();

	const userData = await findUserById(user_id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const oldToken = await getTokenFromTargetId(userData.id, { action: TokenAction.RESET_PASSWORD });

	if (oldToken) {
		const tokenCreationTimestamp = oldToken.created_at.getTime();
		const now = Date.now();
		const timeDiff = Math.round((now - tokenCreationTimestamp) / 1000);
		if (timeDiff < 60) {
			throw buildApiError({
				code: ApiErrorCode.TOKEN_ALREADY_SENT,
				message: 'Wait a minute before sending a new reset password email',
				status: StatusCode.FORBIDDEN,
			});
		}
		await deleteTokenById(oldToken.id);
	}

	const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2);
	const token = generateToken(userData, expirationDate, TokenAction.RESET_PASSWORD);
	const savedToken = await createToken({
		token,
		expiration_date: new Date(expirationDate),
		action: TokenAction.RESET_PASSWORD,
		created_by: currentUser.id,
		target_id: userData.id,
	});

	await sendResetPasswordEmail(userData, savedToken);

	const safeTokenData: Optional<IToken, 'token'> = savedToken;
	delete safeTokenData.token;

	return NextResponse.json(safeTokenData);
});