import { NextResponse } from 'next/server';
import { z } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserWithPasswordById, updateUserPassword } from '@/database/user/user.repository';
import { SettingName } from '@/schemas/setting';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword, verifyPassword } from '@/utils/password.util';

export const PUT = routeHandler(async (request, { currentUser }) => {

	const body = await request.json();

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

	const UpdateUserPasswordSchema = z.object({
		password: z.string().min(1, 'Required.'),
		newPassword: z.string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }),
	});

	const { password, newPassword } = UpdateUserPasswordSchema.parse(body);

	const userData = await findUserWithPasswordById(currentUser.id);

	if (!userData) {
		throw buildApiError({
			code: ApiErrorCode.USER_NOT_FOUND,
			status: StatusCode.NOT_FOUND,
		});
	}

	if (!userData.password) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_AUTH_METHOD,
			status: StatusCode.CONFLICT,
		});
	}

	const isPasswordValid = await verifyPassword(password, userData.password);

	if (!isPasswordValid) {
		throw buildApiError({
			code: ApiErrorCode.WRONG_PASSWORD,
			status: StatusCode.UNAUTHORIZED,
		});
	}

	const hashedPassword = await hashPassword(newPassword);
	await updateUserPassword(userData.id, hashedPassword, currentUser.id);

	return NextResponse.json({ message: 'Updated.' });
}, { authGuard: true });