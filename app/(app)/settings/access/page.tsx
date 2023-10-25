import { Unlock } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import { findOwnerUser } from '@/database/user/user.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';

const ShareSettings = nextDynamic(() => import('../_components/ShareSettings'));

export const dynamic = 'force-dynamic';

const AccessSettingsPage = async () => {

	await connectToDatabase();

	const csrfToken = await getCsrfToken(headers());

	const ownerUser = await findOwnerUser();

	return (
		<div className="col-span-2 flex flex-col gap-8 mt-0">
			<h2 className="text-xl font-semibold flex gap-2 items-center"><Unlock size="16" /> Access settings</h2>
			<ShareSettings
				csrfToken={ csrfToken }
				ownerUser={ ownerUser }
			/>
		</div>
	);
};

export default AccessSettingsPage;