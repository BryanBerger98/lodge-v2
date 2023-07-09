import { User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import { getCsrfToken } from '@/utils/csrf.util';

const DynamicSignOutButton = dynamic(() => import('./_components/SignOutButton'), { ssr: false });
const DynamicUpdateUsernameForm = dynamic(() => import('./_components/UpdateUsernameForm'), { ssr: false });
const DynamicUpdatePhoneNumberForm = dynamic(() => import('./_components/UpdatePhoneNumberForm'), { ssr: false });
const DynamicUpdateAvatarForm = dynamic(() => import('./_components/UpdateAvatarForm'), { ssr: false });
const DynamicUpdateEmailForm = dynamic(() => import('./_components/UpdateEmailForm'), { ssr: false });
const DynamicUpdatePasswordForm = dynamic(() => import('./_components/UpdatePasswordForm'), { ssr: false });

const AccountPage = async () => {

	const csrfToken = await getCsrfToken(headers());

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
					<DynamicSignOutButton className="mr-auto" />
				</div>
			</div>
		</>
	);
};

export default AccountPage;