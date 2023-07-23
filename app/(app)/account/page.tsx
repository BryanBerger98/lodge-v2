import { User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { getCsrfToken } from '@/utils/csrf.util';
import { USER_ACCOUNT_DELETION_SETTING } from '@/utils/settings';

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

	return (
		<>
			<PageTitle><User /> Account</PageTitle>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col gap-8">
					<DynamicUpdateAvatarForm csrfToken={ csrfToken } />
					<DynamicUpdateUsernameForm csrfToken={ csrfToken } />
					<DynamicUpdatePhoneNumberForm csrfToken={ csrfToken } />
					<DynamicUpdateEmailForm csrfToken={ csrfToken } />
					<DynamicUpdatePasswordForm csrfToken={ csrfToken } />
					<div className="mr-auto flex gap-4">
						<DynamicSignOutButton />
						{
							canDeleteAccount && currentUser.role !== 'owner' ?
								<DynamicDeleteAccountButton csrfToken={ csrfToken } />
								: null
						}
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountPage;