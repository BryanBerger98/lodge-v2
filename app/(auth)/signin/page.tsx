import dynamic from 'next/dynamic';

import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { APPLE_AUTH_SETTING, GOOGLE_AUTH_SETTING, MAGIC_LINK_SIGNIN_SETTING, NEW_USERS_SIGNUP_SETTING, USER_VERIFY_EMAIL_SETTING, findDefaultSettingByName } from '@/utils/settings';

const DynamicSignInCard = dynamic(() => import('./_components/SignInCard'));
const DynamicEmailSignInForm = dynamic(() => import('./_components/EmailSignInForm'));
const DynamicPasswordSignInForm = dynamic(() => import('./_components/PasswordSignInForm'));
const DynamicMagicEmailSent = dynamic(() => import('./_components/MagicEmailSent'));

const SignInPage = async () => {

	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);
	const defaultNewUserSignUpSetting = findDefaultSettingByName(NEW_USERS_SIGNUP_SETTING);
	const userVerifyEmailSetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);
	const defaultUserVerifyEmailSetting = findDefaultSettingByName(USER_VERIFY_EMAIL_SETTING);
	const magicLinkSignInSetting = await findSettingByName(MAGIC_LINK_SIGNIN_SETTING);
	const defaultMagicLinkSignInSetting = findDefaultSettingByName(MAGIC_LINK_SIGNIN_SETTING);

	const googleAuthSetting = await findSettingByName(GOOGLE_AUTH_SETTING);
	const defaultGoogleAuthSetting = await findDefaultSettingByName(GOOGLE_AUTH_SETTING);
	const appleAuthSetting = await findSettingByName(APPLE_AUTH_SETTING);
	const defaultAppleAuthSetting = await findDefaultSettingByName(APPLE_AUTH_SETTING);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignInCard>
				<DynamicEmailSignInForm
					appleAuthSetting={ appleAuthSetting || defaultAppleAuthSetting || null }
					googleAuthSetting={ googleAuthSetting || defaultGoogleAuthSetting || null }
					newUserSignUpSetting={ newUserSignUpSetting || defaultNewUserSignUpSetting || null }
				/>
				<DynamicPasswordSignInForm
					magicLinkSignInSetting={ magicLinkSignInSetting || defaultMagicLinkSignInSetting || null }
					userVerifyEmailSetting={ userVerifyEmailSetting || defaultUserVerifyEmailSetting || null }
				/>
				<DynamicMagicEmailSent />
			</DynamicSignInCard>
		</div>
	);
};

export default SignInPage;