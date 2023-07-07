import { User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

const DynamicSignOutButton = dynamic(() => import('./_components/SignOutButton'), { ssr: false });
const DynamicUpdateUsernameForm = dynamic(() => import('./_components/UpdateUsernameForm'), { ssr: false });
const DynamicUpdateAvatarForm = dynamic(() => import('./_components/UpdateAvatarForm'), { ssr: false });
const DynamicUpdateEmailForm = dynamic(() => import('./_components/UpdateEmailForm'), { ssr: false });
const DynamicUpdatePasswordForm = dynamic(() => import('./_components/UpdatePasswordForm'), { ssr: false });

const AccountPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<>
			<h1 className="text-2xl font-semibold flex gap-2 items-center mb-16"><User /> Account</h1>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col gap-8">
					<DynamicUpdateAvatarForm csrfToken={ csrfToken } />
					<DynamicUpdateUsernameForm csrfToken={ csrfToken } />
					<DynamicUpdateEmailForm csrfToken={ csrfToken } />
					<DynamicUpdatePasswordForm csrfToken={ csrfToken } />
					<DynamicSignOutButton className="mr-auto" />
				</div>
			</div>
		</>
	);
};

export default AccountPage;