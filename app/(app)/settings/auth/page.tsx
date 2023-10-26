import { KeyRound } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/lib/csrf';
import { Env } from '@/utils/env.util';

const DynamicPasswordSettings = nextDynamic(() => import('../_components/AuthSettings/PasswordSettings'));
const DynamicProvidersSettings = nextDynamic(() => import('../_components/AuthSettings/ProvidersSettings'));

export const dynamic = 'force-dynamic';

const AuthSettingsPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	const isGoogleAuthEnvProvided = Env.GOOGLE_CLIENT_ID && Env.GOOGLE_CLIENT_SECRET ? true : false;

	return (
		<div className="flex flex-col gap-8 mt-0">
			<h2 className="text-xl font-semibold flex gap-2 items-center"><KeyRound size="16" /> Authentication settings</h2>
			<DynamicPasswordSettings csrfToken={ csrfToken } />
			<DynamicProvidersSettings
				csrfToken={ csrfToken }
				isGoogleAuthEnvProvided={ isGoogleAuthEnvProvided }
			/>
		</div>
	);
};

export default AuthSettingsPage;