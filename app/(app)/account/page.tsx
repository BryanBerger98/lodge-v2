import { User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';
import { SettingName } from '@/schemas/setting/name.shema';
import { setServerAuthGuard } from '@/utils/auth';

const PageTitle = dynamic(() => import('@/components/layout/Header/PageTitle'));
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

	const userAccountDeletionSetting = await findSettingByName(SettingName.USER_ACCOUNT_DELETION);

	const canDeleteAccount = userAccountDeletionSetting && userAccountDeletionSetting.data_type === 'boolean' && userAccountDeletionSetting.value;

	const passwordLowercaseMinSetting = await findSettingByName(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordUppercaseMinSetting = await findSettingByName(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordNumbersMinSetting = await findSettingByName(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordSymbolsMinSetting = await findSettingByName(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordMinLengthSetting = await findSettingByName(SettingName.PASSWORD_MIN_LENGTH);
	const passwordUniqueCharsSetting = await findSettingByName(SettingName.PASSWORD_UNIQUE_CHARS);

	return (
		<>
			<PageTitle><User /> Account</PageTitle>
			<div className="grid grid-cols-1 xl:grid-cols-3">
				<div className="xl:col-span-2 flex flex-col gap-y-8 mb-8">
					<DynamicUpdateAvatarForm csrfToken={ csrfToken } />
					<DynamicUpdateUsernameForm csrfToken={ csrfToken } />
					<DynamicUpdatePhoneNumberForm csrfToken={ csrfToken } />
					{
						currentUser.provider_data === 'email' ?
							<DynamicUpdateEmailForm csrfToken={ csrfToken } />
							: null
					}
					{
						!currentUser.has_password ?
							<Card>
								<CardHeader>
									<CardTitle>Password</CardTitle>
									<CardDescription>
										Setup a password.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<span className="text-base">To setup a password you need to follow the </span>
									<Button
										className="px-0 text-base text-blue-500"
										variant="link"
										asChild
									>
										<Link href="/forgot-password">forgot password</Link>
									</Button>
									<span> process.</span>
								</CardContent>
							</Card>
							: <DynamicUpdatePasswordForm
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
					}
					{
						currentUser.provider_data === 'google' ?
							<Card>
								<CardHeader>
									<CardTitle>Signed in with Google</CardTitle>
									<CardDescription>
										You created your account using Google authentication. You cannot change your email address.
									</CardDescription>
								</CardHeader>
								<CardContent>
									Signed in as <span className="font-bold">{ currentUser.email }</span>.
								</CardContent>
							</Card>
							: null
					}
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