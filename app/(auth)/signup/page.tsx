import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/utils/csrf.util';
import { NEW_USERS_SIGNUP_SETTING, PASSWORD_LOWERCASE_MIN_SETTING, PASSWORD_MIN_LENGTH_SETTING, PASSWORD_NUMBERS_MIN_SETTING, PASSWORD_SYMBOLS_MIN_SETTING, PASSWORD_UNIQUE_CHARS_SETTING, PASSWORD_UPPERCASE_MIN_SETTING, USER_VERIFY_EMAIL_SETTING } from '@/utils/settings';


const DynamicSignUpForm = dynamic(() => import('./_components/SignUpForm'));

const SignUpPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const newUserSignUpSetting = await findSettingByName(NEW_USERS_SIGNUP_SETTING);
	
	if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
		redirect('/signin');
	}

	const userVerifyEmailSetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);

	const passwordLowercaseMinSetting = await findSettingByName(PASSWORD_LOWERCASE_MIN_SETTING);
	const passwordUppercaseMinSetting = await findSettingByName(PASSWORD_UPPERCASE_MIN_SETTING);
	const passwordNumbersMinSetting = await findSettingByName(PASSWORD_NUMBERS_MIN_SETTING);
	const passwordSymbolsMinSetting = await findSettingByName(PASSWORD_SYMBOLS_MIN_SETTING);
	const passwordMinLengthSetting = await findSettingByName(PASSWORD_MIN_LENGTH_SETTING);
	const passwordUniqueCharsSetting = await findSettingByName(PASSWORD_UNIQUE_CHARS_SETTING);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignUpForm
				csrfToken={ csrfToken }
				passwordRules={ {
					uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
					lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
					numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
					symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
					min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
					should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
				} }
				userVerifyEmailSetting={ userVerifyEmailSetting }
			/>
		</div>
	);
};

export default SignUpPage;