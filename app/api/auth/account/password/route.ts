import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserWithPasswordById, updateUserPassword } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword, verifyPassword } from '@/utils/password.util';
import { SETTING_NAMES } from '@/utils/settings';

export const PUT = async (request: NextRequest) => {

	try {

		await connectToDatabase();

		const body = await request.json();

		const passwordLowercaseMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING);
		const passwordUppercaseMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING);
		const passwordNumbersMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING);
		const passwordSymbolsMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING);
		const passwordMinLengthSetting = await findSettingByName(SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING);
		const passwordUniqueCharsSetting = await findSettingByName(SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING);

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

		const { user: currentUser } = await setServerAuthGuard();

		const userData = await findUserWithPasswordById(currentUser.id);

		if (!userData) {
			throw buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			});
		}

		const isPasswordValid = await verifyPassword(password, userData.password);

		if (!isPasswordValid) {
			throw buildError({
				message: 'Wrong password.',
				code: WRONG_PASSWORD_ERROR,
				status: 401,
			});
		}

		const hashedPassword = await hashPassword(newPassword);
		await updateUserPassword(userData.id, hashedPassword, currentUser.id);

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
			code: error.code || INTERNAL_ERROR,
			message: error.message || 'An error occured.',
			status: error.status || 500,
			data: error,
		}));
	}

};