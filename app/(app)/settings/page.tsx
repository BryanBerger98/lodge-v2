import { Settings } from 'lucide-react';
import dynamic from 'next/dynamic';

import PageTitle from '@/components/layout/PageTitle';
const DynamicShareSettings = dynamic(() => import('./_components/ShareSettings'));

const SettingsPage = () => {

	return (
		<>
			<PageTitle><Settings /> Settings</PageTitle>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col gap-8">
					<DynamicShareSettings />
				</div>
			</div>
		</>
	);
};

export default SettingsPage;