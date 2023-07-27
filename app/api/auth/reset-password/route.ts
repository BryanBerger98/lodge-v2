import { NextRequest, NextResponse } from 'next/server';
import { ZodError, object, string } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken, deleteTokenById, getTokenFromTargetId, getTokenFromTokenString } from '@/database/token/token.repository';
import { findUserByEmail, findUserById, updateUserPassword } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { IToken } from '@/types/token.type';
import { Optional } from '@/types/utils.type';
import { sendResetPasswordEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, INVALID_TOKEN_ERROR, TOKEN_ALREADY_SENT_ERROR, TOKEN_NOT_FOUND_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword } from '@/utils/password.util';
import { PASSWORD_LOWERCASE_MIN_SETTING, PASSWORD_MIN_LENGTH_SETTING, PASSWORD_NUMBERS_MIN_SETTING, PASSWORD_SYMBOLS_MIN_SETTING, PASSWORD_UNIQUE_CHARS_SETTING, PASSWORD_UPPERCASE_MIN_SETTING } from '@/utils/settings';
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

		const passwordLowercaseMinSetting = await findSettingByName(PASSWORD_LOWERCASE_MIN_SETTING);
		const passwordUppercaseMinSetting = await findSettingByName(PASSWORD_UPPERCASE_MIN_SETTING);
		const passwordNumbersMinSetting = await findSettingByName(PASSWORD_NUMBERS_MIN_SETTING);
		const passwordSymbolsMinSetting = await findSettingByName(PASSWORD_SYMBOLS_MIN_SETTING);
		const passwordMinLengthSetting = await findSettingByName(PASSWORD_MIN_LENGTH_SETTING);
		const passwordUniqueCharsSetting = await findSettingByName(PASSWORD_UNIQUE_CHARS_SETTING);

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