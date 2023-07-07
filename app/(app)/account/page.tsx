import { User } from 'lucide-react';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

import UpdateUsernameForm from './_components/UpdateUsernameForm';

const AccountPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<>
			<h1 className="text-2xl font-semibold flex gap-2 items-center mb-16"><User /> Account</h1>
			<div className="grid grid-cols-3">
				<div className="col-span-2">
					<UpdateUsernameForm csrfToken={ csrfToken } />
				</div>
			</div>
		</>
	);
};

export default AccountPage;