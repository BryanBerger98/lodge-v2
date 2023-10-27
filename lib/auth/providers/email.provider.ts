import Email from 'next-auth/providers/email';

import { findUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { buildApiError } from '@/utils/api/error';
import { ApiErrorCode } from '@/utils/api/error/error-codes.util';
import { StatusCode } from '@/utils/api/http-status';
import { sendMagicLinkSignInEmail } from '@/utils/email';

const EmailProvider = Email({
	sendVerificationRequest: async ({ url, identifier }) => {
		try {
			await connectToDatabase();
			const user = await findUserByEmail(identifier);

			if (!user) {
				throw buildApiError({
					code: ApiErrorCode.USER_NOT_FOUND,
					status: StatusCode.NOT_FOUND,
				});
			}

			if (user.is_disabled) {
				throw buildApiError({
					code: ApiErrorCode.ACCOUNT_DISABLED,
					status: StatusCode.UNAUTHORIZED,
				});
			}

			await sendMagicLinkSignInEmail(user, url);
			return;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	},
});

export default EmailProvider;