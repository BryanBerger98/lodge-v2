import { NextResponse } from 'next/server';
import { z } from 'zod';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken } from '@/database/token/token.repository';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { generateToken } from '@/lib/jwt';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { TokenAction } from '@/schemas/token.schema';
import { routeHandler } from '@/utils/api';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { ReasonPhrase, StatusCode } from '@/utils/api/http-status';
import { sendAccountVerificationEmail } from '@/utils/email';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules, hashPassword } from '@/utils/password.util';

import { SignUpUserSchema } from './_schemas/signup-user.schema';

export const POST = routeHandler(async (request) => {
	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(SettingName.NEW_USERS_SIGNUP);

	if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
		throw buildApiError({ status: StatusCode.FORBIDDEN });
	}

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

	const body = await request.json();
	const SignUpSchema = SignUpUserSchema.setKey('password', z.string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }));
	const { email, password } = SignUpSchema.parse(body);

	const existingUser = await findUserByEmail(email);

	if (existingUser) {
		throw buildApiError({
			code: ApiErrorCode.USER_ALREADY_EXISTS,
			status: StatusCode.UNPROCESSABLE_ENTITY,
		});
	}

	const hashedPassword = await hashPassword(password);

	const createdUser = await createUser({
		email,
		password: hashedPassword,
		has_password: true,
		provider_data: AuthenticationProvider.EMAIL,
		role: Role.USER,
	});

	if (createdUser.has_email_verified) {
		return NextResponse.json(createdUser, {
			status: StatusCode.CREATED,
			statusText: ReasonPhrase.CREATED, 
		});
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

	return NextResponse.json(createdUser, {
		status: StatusCode.CREATED,
		statusText: ReasonPhrase.CREATED, 
	});
});