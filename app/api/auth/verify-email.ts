import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { connectToDatabase } from '@/config/database.config';
import { createToken } from '@/database/token/token.repository';
import { findUserById } from '@/database/user/user.repository';
import { sendAccountVerificationEmail } from '@/utils/email';
import { buildError, sendError } from '@/utils/error.util';
import { generateToken } from '@/utils/token.util';

import { authOptions } from './[...nextauth]/route';

export const GET = async () => {

	try {
		await connectToDatabase();

		const session = await getServerSession(authOptions);
		const currentUser = session?.user;

		if (!currentUser?.id) {
			return sendError(buildError({
				message: 'Unauthorized.',
				status: 401,
			}));
		}

		const userData = await findUserById(currentUser.id);

		if (!userData) {
			return sendError(buildError({
				message: 'User not found.',
				status: 404,
			}));
		}

		if (userData.has_email_verified) {
			return sendError(buildError({
				message: 'Email already verified.',
				status: 500,
			}));
		}

		const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
		const token = generateToken(userData, expirationDate, 'account_verification');
		const savedToken = await createToken({
			token,
			expiration_date: new Date(expirationDate),
			action: 'email_verification',
			created_by: currentUser.id,
		});

		const emailResponse = sendAccountVerificationEmail(userData, savedToken);

		return NextResponse.json(emailResponse);
	} catch (error) {
		sendError(error);
	}
};