import { KeyRound } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import { Heading2 } from '@/components/ui/Typography/heading';
import { getCsrfToken } from '@/lib/csrf';
import { Env } from '@/utils/env.util';

const PasswordSettings = nextDynamic(() => import('../_components/AuthSettings/PasswordSettings'));
const ProvidersSettings = nextDynamic(() => import('../_components/AuthSettings/ProvidersSettings'));

export const dynamic = 'force-dynamic';

const AuthSettingsPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	const isGoogleAuthEnvProvided = Env.GOOGLE_CLIENT_ID && Env.GOOGLE_CLIENT_SECRET ? true : false;

	return (
		<div className="flex flex-col gap-8 mt-0 w-1/2">
			<Heading2 className="flex gap-2 items-center"><KeyRound /> Authentication settings</Heading2>
			<PasswordSettings csrfToken={ csrfToken } />
			<ProvidersSettings
				csrfToken={ csrfToken }
				isGoogleAuthEnvProvided={ isGoogleAuthEnvProvided }
			/>
		</div>
	);
};

export default AuthSettingsPage;