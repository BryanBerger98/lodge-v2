'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ButtonList from '@/components/ui/Button/ButtonList';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useSettings from '@/context/settings/useSettings';
import { BRAND_NAME_SETTING } from '@/utils/settings';

import BrandNameFormDialog from './Dialogs/BrandNameFormDialog';

const BrandSettingsForm = () => {

	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();
	const isBrandNameDialogOpen = searchParams.get('edit_setting') === 'brand-name';

	const { getSetting, loading } = useSettings();

	const brandNameSetting = getSetting(BRAND_NAME_SETTING);

	const handleClick = () => {
		console.log('Hello world');
	};

	const handleClickBrandName = () => { 
		const params = new URLSearchParams(searchParams);
		params.set('edit_setting', 'brand-name');
		router.push(`${ pathname }?${ params.toString() }`);
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Brand</CardTitle>
					<CardDescription>Add the name and the logo of your business.</CardDescription>
				</CardHeader>
				<CardContent>
					<ButtonList>
						<ButtonItem
							isLoading={ loading === 'pending' }
							value={ brandNameSetting?.data_type === 'string' && brandNameSetting?.value !== undefined ? brandNameSetting.value : 'Lodge' }
							onClick={ handleClickBrandName }
						>
							Brand name
						</ButtonItem>
						<ButtonItem
							value="Upload a logo"
							onClick={ handleClick }
						>
							Logo
						</ButtonItem>
					</ButtonList>
				</CardContent>
			</Card>
			<BrandNameFormDialog isOpen={ isBrandNameDialogOpen } />
		</>
	);
};

export default BrandSettingsForm;