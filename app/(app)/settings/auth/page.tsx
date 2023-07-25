import { KeyRound } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

const DynamicPasswordSettings = nextDynamic(() => import('../_components/AuthSettings/PasswordSettings'));

export const dynamic = 'force-dynamic';

const AuthSettingsPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="flex flex-col gap-8 mt-0">
			<h2 className="text-xl font-semibold flex gap-2 items-center"><KeyRound size="16" /> Authentication settings</h2>
			<DynamicPasswordSettings csrfToken={ csrfToken } />
		</div>
	);
};

export default AuthSettingsPage;