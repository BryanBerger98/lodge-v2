import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/utils/csrf.util';
import { NEW_USERS_SIGNUP_SETTING, USER_VERIFY_EMAIL_SETTING } from '@/utils/settings';


const DynamicSignUpForm = dynamic(() => import('./_components/SignUpForm'));

const SignUpPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);
	
	if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
		redirect('/signin');
	}

	const userVerifyEmailSetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignUpForm
				csrfToken={ csrfToken }
				userVerifyEmailSetting={ userVerifyEmailSetting }
			/>
		</div>
	);
};

export default SignUpPage;