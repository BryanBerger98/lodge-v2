'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ButtonList from '@/components/ui/Button/ButtonList';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useSettings from '@/context/settings/useSettings';
import { SETTING_NAMES } from '@/utils/settings';

import BrandLogoFormDialog from './Dialogs/BrandLogoFormDialog';
import BrandNameFormDialog from './Dialogs/BrandNameFormDialog';

const BrandSettingsForm = () => {

	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();
	const isBrandNameDialogOpen = searchParams.get('edit_setting') === 'brand-name';
	const isBrandLogoDialogOpen = searchParams.get('edit_setting') === 'brand-logo';

	const { getSetting, loading } = useSettings();

	const brandNameSetting = getSetting(SETTING_NAMES.BRAND_NAME_SETTING);

	const handleClick = () => {
		console.log('Hello world');
	};

	const handleClickSettingButton = (settingName: string) => () => { 
		const params = new URLSearchParams(searchParams);
		params.set('edit_setting', settingName);
		router.push(`${ pathname }?${ params.toString() }`);
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Brand</CardTitle>
					<CardDescription>Add the name and the logo of your business.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<ButtonList>
						<ButtonItem
							value="Upload a logo"
							onClick={ handleClickSettingButton('brand-logo') }
						>
							Logo
						</ButtonItem>
					</ButtonList>
					<ButtonList>
						<ButtonItem
							isLoading={ loading === 'pending' }
							value={ brandNameSetting?.data_type === 'string' ? brandNameSetting.value : '' }
							onClick={ handleClickSettingButton('brand-name') }
						>
							Brand name
						</ButtonItem>
						<ButtonItem
							value="Upload a favicon"
							onClick={ handleClick }
						>
							Favicon
						</ButtonItem>
					</ButtonList>
				</CardContent>
			</Card>
			<BrandNameFormDialog isOpen={ isBrandNameDialogOpen } />
			<BrandLogoFormDialog isOpen={ isBrandLogoDialogOpen } />
		</>
	);
};

export default BrandSettingsForm;