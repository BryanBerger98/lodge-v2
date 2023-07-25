import { User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { getCsrfToken } from '@/utils/csrf.util';
import { PASSWORD_LOWERCASE_MIN_SETTING, PASSWORD_MIN_LENGTH_SETTING, PASSWORD_NUMBERS_MIN_SETTING, PASSWORD_SYMBOLS_MIN_SETTING, PASSWORD_UNIQUE_CHARS_SETTING, PASSWORD_UPPERCASE_MIN_SETTING, USER_ACCOUNT_DELETION_SETTING } from '@/utils/settings';

const DynamicSignOutButton = dynamic(() => import('./_components/SignOutButton'), { ssr: false });
const DynamicDeleteAccountButton = dynamic(() => import('./_components/DeleteAccountButton'), { ssr: false });
const DynamicUpdateUsernameForm = dynamic(() => import('./_components/UpdateUsernameForm'), { ssr: false });
const DynamicUpdatePhoneNumberForm = dynamic(() => import('./_components/UpdatePhoneNumberForm'), { ssr: false });
const DynamicUpdateAvatarForm = dynamic(() => import('./_components/UpdateAvatarForm'), { ssr: false });
const DynamicUpdateEmailForm = dynamic(() => import('./_components/UpdateEmailForm'), { ssr: false });
const DynamicUpdatePasswordForm = dynamic(() => import('./_components/UpdatePasswordForm'), { ssr: false });

const AccountPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard();

	const userAccountDeletionSetting = await findSettingByName(USER_ACCOUNT_DELETION_SETTING);

	const canDeleteAccount = userAccountDeletionSetting && userAccountDeletionSetting.data_type === 'boolean' && userAccountDeletionSetting.value;

	const passwordLowercaseMinSetting = await findSettingByName(PASSWORD_LOWERCASE_MIN_SETTING);
	const passwordUppercaseMinSetting = await findSettingByName(PASSWORD_UPPERCASE_MIN_SETTING);
	const passwordNumbersMinSetting = await findSettingByName(PASSWORD_NUMBERS_MIN_SETTING);
	const passwordSymbolsMinSetting = await findSettingByName(PASSWORD_SYMBOLS_MIN_SETTING);
	const passwordMinLengthSetting = await findSettingByName(PASSWORD_MIN_LENGTH_SETTING);
	const passwordUniqueCharsSetting = await findSettingByName(PASSWORD_UNIQUE_CHARS_SETTING);

	return (
		<>
			<PageTitle><User /> Account</PageTitle>
			<div className="grid grid-cols-1 xl:grid-cols-3">
				<div className="xl:col-span-2 flex flex-col gap-y-8 mb-8">
					<DynamicUpdateAvatarForm csrfToken={ csrfToken } />
					<DynamicUpdateUsernameForm csrfToken={ csrfToken } />
					<DynamicUpdatePhoneNumberForm csrfToken={ csrfToken } />
					<DynamicUpdateEmailForm csrfToken={ csrfToken } />
					<DynamicUpdatePasswordForm
						csrfToken={ csrfToken }
						passwordRules={ {
							uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
							lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
							numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
							symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
							min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
							should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
						} }
					/>
				</div>
			</div>
			<div className="flex gap-4">
				<DynamicSignOutButton />
				{
					canDeleteAccount && currentUser.role !== 'owner' ?
						<DynamicDeleteAccountButton csrfToken={ csrfToken } />
						: null
				}
			</div>
		</>
	);
};

export default AccountPage;