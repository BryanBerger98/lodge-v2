import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken } from '@/database/token/token.repository';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { Role } from '@/schemas/role.schema';
import { TokenAction } from '@/schemas/token.schema';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendBuiltErrorWithSchemaValidation } from '@/utils/error';
import { FORBIDDEN_ERROR, INTERNAL_ERROR, USER_ALREADY_EXISTS_ERROR } from '@/utils/error/error-codes';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword } from '@/utils/password.util';
import { SETTING_NAMES } from '@/utils/settings';

import { SignUpUserSchema } from './_schemas/signup-user.schema';

export const POST = async (request: NextRequest) => {

	try {
		await connectToDatabase();

		const newUserSignUpSetting = await findSettingByName(SETTING_NAMES.NEW_USERS_SIGNUP_SETTING);

		if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
			throw buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			});
		}

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

		const body = await request.json();
		const SignUpSchema = SignUpUserSchema.setKey('password', z.string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }));
		const { email, password } = SignUpSchema.parse(body);

		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			throw buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			});
		}

		const hashedPassword = await hashPassword(password);

		const createdUser = await createUser({
			email,
			password: hashedPassword,
			provider_data: AuthenticationProvider.EMAIL,
			role: Role.USER,
		});

		if (!createdUser) {
			throw buildError({
				code: INTERNAL_ERROR,
				message: 'User not created.',
				status: 500,
			});
		}

		if (createdUser.has_email_verified) {
			return NextResponse.json(createdUser, { status: 201 });
		}

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
		const token = generateToken(createdUser, expirationDate, TokenAction.EMAIL_VERIFICATION);
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: TokenAction.EMAIL_VERIFICATION,
			created_by: createdUser.id,
			target_id: createdUser.id,
		});

		await sendAccountVerificationEmail(createdUser, savedToken);

		return NextResponse.json(createdUser, { status: 201 });
	} catch (error: any) {
		console.error(error);
		return sendBuiltErrorWithSchemaValidation(error);
	}
};