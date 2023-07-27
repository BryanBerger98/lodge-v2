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
			<DynamicSignInForm
				newUserSignUpSetting={ newUserSignUpSetting }
				userVerifyEmailSetting={ userVerifyEmailSetting }
			/>
		</div>
	);
};

export default SignInPage;