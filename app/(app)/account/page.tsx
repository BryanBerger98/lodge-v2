import { User } from 'lucide-react';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

import SignOutButton from './_components/SignOutButton';
import UpdateEmailForm from './_components/UpdateEmailForm';
import UpdateUsernameForm from './_components/UpdateUsernameForm';

const AccountPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<>
			<h1 className="text-2xl font-semibold flex gap-2 items-center mb-16"><User /> Account</h1>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col gap-8">
					<UpdateUsernameForm csrfToken={ csrfToken } />
					<UpdateEmailForm csrfToken={ csrfToken } />
					<SignOutButton className="mr-auto" />
				</div>
			</div>
		</>
	);
};

export default AccountPage;