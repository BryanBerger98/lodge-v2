import { NextRequest, NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database.config';
import { SignUpUserSchema } from '@/database/user/user.dto';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { buildError, sendError } from '@/utils/error.util';
import { hashPassword } from '@/utils/password.util';

export const POST = async (request: NextRequest) => {

	await connectToDatabase();

	try {
		const body = await request.json();
		const { email, password } = SignUpUserSchema.parse(body);

		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			return sendError(buildError({
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

		return NextResponse.json(createdUser, { status: 201 });
	} catch (error) {
		return sendError(error);
	}
};