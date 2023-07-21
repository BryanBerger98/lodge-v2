import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { connectToDatabase } from '@/config/database.config';
import { UpdateUserEmailSchema } from '@/database/user/user.dto';
import { findUserWithPasswordById, updateUser } from '@/database/user/user.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { buildError, sendError } from '@/utils/error';
import { INTERNAL_ERROR, INVALID_INPUT_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '@/utils/error/error-codes';
import { verifyPassword } from '@/utils/password.util';


export const PUT = async (request: NextRequest) => {

	try {

		await connectToDatabase();

		const body = await request.json();

		const { email, password } = UpdateUserEmailSchema.parse(body);

		const { user: currentUser } = await setServerAuthGuard();

		const user = await findUserWithPasswordById(currentUser.id);

		if (!user) {
			return sendError(buildError({
				code: USER_NOT_FOUND_ERROR,
				message: 'User not found.',
				status: 404,
			}));
		}

		const isPasswordValid = await verifyPassword(password, user.password);

		if (!isPasswordValid) {
			return sendError(buildError({
				message: 'Wrong password.',
				code: WRONG_PASSWORD_ERROR,
				status: 401,
			}));
		}

		const updatedUser = await updateUser({
			id: currentUser.id,
			email,
			updated_by: currentUser.id,
		}, { newDocument: true });

		return NextResponse.json(updatedUser);
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