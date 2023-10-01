import { headers } from 'next/headers';

import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/lib/csrf';
import { SETTING_NAMES } from '@/utils/settings';

import ResetPasswordForm from '../_components/ResetPasswordForm';

type ResetPasswordPageProps = {
	params: {
		token: string;
	};
};

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
	const csrfToken = await getCsrfToken(headers());

	const passwordLowercaseMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING);
	const passwordUppercaseMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING);
	const passwordNumbersMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING);
	const passwordSymbolsMinSetting = await findSettingByName(SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING);
	const passwordMinLengthSetting = await findSettingByName(SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING);
	const passwordUniqueCharsSetting = await findSettingByName(SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING);

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