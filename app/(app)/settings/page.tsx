import { Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import SettingsProvider from '@/context/settings';
import { findOwnerUser } from '@/database/user/user.repository';
import { getCsrfToken } from '@/utils/csrf.util';
const DynamicShareSettings = dynamic(() => import('./_components/ShareSettings'));

const SettingsPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	const ownerUser = await findOwnerUser();

	return (
		<>
			<PageTitle><Settings /> Settings</PageTitle>
			<SettingsProvider>
				<div className="grid grid-cols-3">
					<div className="col-span-2 flex flex-col gap-8">
						<DynamicShareSettings
							csrfToken={ csrfToken }
							ownerUser={ ownerUser }
						/>
					</div>
				</div>
			</SettingsProvider>
		</>
	);
};

export default SettingsPage;