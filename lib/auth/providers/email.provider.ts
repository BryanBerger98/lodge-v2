import Email from 'next-auth/providers/email';

import { findUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { sendMagicLinkSignInEmail } from '@/utils/email';
import { buildError } from '@/utils/error';
import { ACCOUNT_DISABLED_ERROR, INTERNAL_ERROR, USER_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

const EmailProvider = Email({
	sendVerificationRequest: async ({ url, identifier }) => {
		try {
			await connectToDatabase();
			const user = await findUserByEmail(identifier);

			if (!user) {
				throw buildError({
					code: USER_NOT_FOUND_ERROR,
					message: 'User not found.',
					status: 404,
				});
			}

			if (user.is_disabled) {
				throw buildError({
					code: ACCOUNT_DISABLED_ERROR,
					message: 'Account disabled.',
					status: 403,
				});
			}

			await sendMagicLinkSignInEmail(user, url);
			return;
		} catch (error: any) {
			console.error(error);
			throw buildError({
				code: INTERNAL_ERROR,
				message: error.message || 'An error occured.',
				status: 500,
				data: error,
			});
		}
	},
});

export default EmailProvider;