import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { createToken } from '@/database/token/token.repository';
import { SignUpUserSchema } from '@/database/user/user.dto';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error';
import { FORBIDDEN_ERROR, INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_ALREADY_EXISTS_ERROR } from '@/utils/error/error-codes';
import { hashPassword } from '@/utils/password.util';
import { NEW_USERS_SIGNUP_SETTING } from '@/utils/settings';
import { generateToken } from '@/utils/token.util';

export const POST = async (request: NextRequest) => {

	try {
		await connectToDatabase();

		const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);

		if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
			return sendError(buildError({
				code: FORBIDDEN_ERROR,
				message: 'Forbidden.',
				status: 403,
			}));
		}

		const body = await request.json();
		const { email, password } = SignUpUserSchema.parse(body);

		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			return sendError(buildError({
				code: USER_ALREADY_EXISTS_ERROR,
				message: 'User already exists.',
				status: 422,
			}));
		}

		const hashedPassword = await hashPassword(password);

		const createdUser = await createUser({
			email,
			password: hashedPassword,
			provider_data: 'email',
			role: 'user',
		});

		if (!createdUser) {
			return sendError(buildError({
				code: INTERNAL_ERROR,
				message: 'User not created.',
				status: 500,
			}));
		}

		if (createdUser.has_email_verified) {
			return NextResponse.json(createdUser, { status: 201 });
		}

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
		const token = generateToken(createdUser, expirationDate, 'email_verification');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'email_verification',
			created_by: createdUser.id,
			target_id: createdUser.id,
		});

		await sendAccountVerificationEmail(createdUser, savedToken);

		return NextResponse.json(createdUser, { status: 201 });
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