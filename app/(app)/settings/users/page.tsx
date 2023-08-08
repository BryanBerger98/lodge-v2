import { Users } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/lib/csrf';

const DynamicUsersSettings = nextDynamic(() => import('../_components/UsersManagementSettings'));

export const dynamic = 'force-dynamic';

const UsersSettingsPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="flex flex-col gap-8 mt-0">
			<h2 className="text-xl font-semibold flex gap-2 items-center"><Users size="16" /> Users settings</h2>
			<DynamicUsersSettings csrfToken={ csrfToken } />
		</div>
	);
};

export default UsersSettingsPage;