import dynamic from 'next/dynamic';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { NEW_USERS_SIGNUP_SETTING } from '@/utils/settings';

const DynamicSignInForm = dynamic(() => import('./_components/SignInForm'));

const SignInPage = async () => {

	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignInForm newUserSignUpSetting={ newUserSignUpSetting } />
		</div>
	);
};

export default SignInPage;