import { Star } from 'lucide-react';
import dynamic from 'next/dynamic';

const BrandSettingsForm = dynamic(() => import('./_components/BrandSettingsForm'));
// const ColorsSettingsForm = dynamic(() => import('./_components/ColorsSettingsForm'));

const BrandingSettingsPage = () => {

	return (
		<div className="flex flex-col gap-8 mt-0 w-full">
			<h2 className="text-xl font-semibold flex gap-2 items-center"><Star size="16" /> Branding settings</h2>
			<div className="grid grid-cols-12">
				<div className="col-start-1 col-span-12 lg:col-span-6 flex flex-col gap-8">
					<BrandSettingsForm />
					{ /* <ColorsSettingsForm /> */ }
				</div>
			</div>
		</div>
	);
};

export default BrandingSettingsPage;