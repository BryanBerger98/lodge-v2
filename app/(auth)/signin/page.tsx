import dynamic from 'next/dynamic';

import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { NEW_USERS_SIGNUP_SETTING, USER_VERIFY_EMAIL_SETTING } from '@/utils/settings';

const DynamicSignInForm = dynamic(() => import('./_components/SignInForm'));

const SignInPage = async () => {

	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);
	const userVerifyEmailSetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);

	return (
		<div className="min-h-screen flex justify-center items-center">
			{ /* 
			
				// TODO:
				IF only one signin option is activated, display directly this option
				For example: if only signin with email/password is activated, directly show the email/password form

				If both of signin with email/password and with magic link are activavted, show EmailForm, then PasswordOrMagicLinkForm

				Show external providers signin on top

			*/ }
			<DynamicSignInForm
				newUserSignUpSetting={ newUserSignUpSetting }
				userVerifyEmailSetting={ userVerifyEmailSetting }
			/>
		</div>
	);
};

export default SignInPage;