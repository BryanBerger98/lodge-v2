import { Star } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Heading2 } from '@/components/ui/Typography/heading';

const BrandSettingsForm = dynamic(() => import('./_components/BrandSettingsForm'));
// const ColorsSettingsForm = dynamic(() => import('./_components/ColorsSettingsForm'));

const BrandingSettingsPage = () => {

	return (
		<div className="flex flex-col gap-8 lg:w-1/2">
			<Heading2 className="flex gap-2 items-center"><Star /> Branding settings</Heading2>
			<BrandSettingsForm />
		</div>
	);
};

export default BrandingSettingsPage;