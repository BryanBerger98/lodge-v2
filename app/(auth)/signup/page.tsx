import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingNumberPopulatedSchema } from '@/schemas/setting';


const SignUpForm = dynamic(() => import('./_components/SignUpForm'));

const SignUpPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const newUserSignUpSettingData = await findSettingByName(SettingName.NEW_USERS_SIGNUP);
	const newUserSignUpSetting = UnregisteredSettingBooleanPopulatedSchema.parse(newUserSignUpSettingData);
	
	if (newUserSignUpSetting && newUserSignUpSetting.data_type === 'boolean' && !newUserSignUpSetting.value) {
		redirect('/signin');
	}

	const userVerifyEmailSettingData = await findSettingByName(SettingName.USER_VERIFY_EMAIL);
	const userVerifyEmailSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userVerifyEmailSettingData);

	const passwordLowercaseMinSettingData = await findSettingByName(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordLowercaseMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordLowercaseMinSettingData);
	const passwordUppercaseMinSettingData = await findSettingByName(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordUppercaseMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordUppercaseMinSettingData);
	const passwordNumbersMinSettingData = await findSettingByName(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordNumbersMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordNumbersMinSettingData);
	const passwordSymbolsMinSettingData = await findSettingByName(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordSymbolsMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordSymbolsMinSettingData);
	const passwordMinLengthSettingData = await findSettingByName(SettingName.PASSWORD_MIN_LENGTH);
	const passwordMinLengthSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordMinLengthSettingData);
	const passwordUniqueCharsSettingData = await findSettingByName(SettingName.PASSWORD_UNIQUE_CHARS);
	const passwordUniqueCharsSetting = UnregisteredSettingBooleanPopulatedSchema.parse(passwordUniqueCharsSettingData);

	const googleAuthSettingData = await findSettingByName(SettingName.GOOGLE_AUTH);
	const googleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(googleAuthSettingData);
	const appleAuthSettingData = await findSettingByName(SettingName.APPLE_AUTH);
	const appleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(appleAuthSettingData);

	return (
		<div className="min-h-screen flex justify-center items-center">
			<SignUpForm
				appleAuthSetting={ appleAuthSetting }
				csrfToken={ csrfToken }
				googleAuthSetting={ googleAuthSetting }
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