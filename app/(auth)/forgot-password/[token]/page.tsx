import { headers } from 'next/headers';

import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/lib/csrf';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingNumberPopulatedSchema } from '@/schemas/setting';

import ResetPasswordForm from '../_components/ResetPasswordForm';

type ResetPasswordPageProps = {
	params: {
		token: string;
	};
};

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
	const csrfToken = await getCsrfToken(headers());

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

	return (
		<div className="min-h-screen flex justify-center items-center">
			<ResetPasswordForm
				csrfToken={ csrfToken }
				passwordRules={ {
					uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
					lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
					numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
					symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
					min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
					should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
				} }
				verificationToken={ params.token }
			/>
		</div>
	);
};

export default ResetPasswordPage;