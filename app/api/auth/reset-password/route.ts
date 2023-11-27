import { NextResponse } from 'next/server';
import { object, string } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUserPassword } from '@/database/user/user.repository';
import { generateToken, verifyToken } from '@/lib/jwt';
import { SettingName } from '@/schemas/setting';
import { IToken, TokenAction } from '@/schemas/token.schema';
import { Optional } from '@/types/utils';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { sendResetPasswordEmail } from '@/utils/email';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword } from '@/utils/password.util';

export const POST = routeHandler(async (request) => {

	const emailSchema = object({ email: string().email('Please, provide a valid email address.').min(1, 'Required.') });

	const body = await request.json();

	const { email } = emailSchema.parse(body);

	const userData = await findUserByEmail(email);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	const oldToken = await getTokenFromTargetId(userData.id, {
		action: TokenAction.RESET_PASSWORD,
		created_by: userData.id, 
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
	const token = generateToken(userData, expirationDate, TokenAction.RESET_PASSWORD);
	const savedToken = await createToken({
		token,
		expiration_date: new Date(expirationDate),
		action: TokenAction.RESET_PASSWORD,
		created_by: userData.id,
		target_id: userData.id,
	});

	await sendResetPasswordEmail(userData, savedToken);

	const safeTokenData: Optional<IToken, 'token'> = savedToken;
	delete safeTokenData.token;

	return NextResponse.json(safeTokenData);
});

export const PUT = routeHandler(async (request) => {

	const passwordLowercaseMinSetting = await findSettingByName(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordUppercaseMinSetting = await findSettingByName(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordNumbersMinSetting = await findSettingByName(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordSymbolsMinSetting = await findSettingByName(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordMinLengthSetting = await findSettingByName(SettingName.PASSWORD_MIN_LENGTH);
	const passwordUniqueCharsSetting = await findSettingByName(SettingName.PASSWORD_UNIQUE_CHARS);

	const passwordRules = {
		uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
		lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
		numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
		symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
		min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
		should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
	};

	const resetPasswordSchema = object({
		token: string().min(1, 'Required.'),
		password: string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }),
	});

	const body = await request.json();
	const { token, password } = resetPasswordSchema.parse(body);

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

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	await deleteTokenById(savedToken.id);

	const hashedPassword = await hashPassword(password);
	await updateUserPassword(userData.id, hashedPassword, userData.id);

	return NextResponse.json({ message: 'Updated.' });
});