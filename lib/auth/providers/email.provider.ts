import Email from 'next-auth/providers/email';

import { findSettingByName } from '@/database/setting/setting.repository';
import { createUser, findUserByEmail } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
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
				const newUserSignUpSetting = await findSettingByName(SettingName.NEW_USERS_SIGNUP);
				const defaultUserRoleSetting = await findSettingByName(SettingName.DEFAULT_USER_ROLE);
			
				if ((newUserSignUpSetting && !newUserSignUpSetting.value) || (defaultUserRoleSetting && !defaultUserRoleSetting.value)) {
					throw buildApiError({ status: StatusCode.FORBIDDEN });
				}
				const createdUser = await createUser({
					email: identifier,
					has_password: false,
					is_disabled: false,
					role: defaultUserRoleSetting?.value ? (defaultUserRoleSetting.value as Role) : Role.USER,
					provider_data: AuthenticationProvider.EMAIL,
					photo: null,
					created_by: null,
				});
				await sendMagicLinkSignInEmail(createdUser, url);
				return;
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