'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ButtonList from '@/components/ui/Button/ButtonList';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import useSettings from '@/context/settings/useSettings';
import { SettingName } from '@/schemas/setting';

import BrandFaviconFormDialog from './Dialogs/BrandFaviconFormDialog';
import BrandLogoFormDialog from './Dialogs/BrandLogoFormDialog';
import BrandNameFormDialog from './Dialogs/BrandNameFormDialog';

const BrandSettingsForm = () => {

	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();
	const isBrandNameDialogOpen = searchParams.get('edit_setting') === 'brand-name';
	const isBrandLogoDialogOpen = searchParams.get('edit_setting') === 'brand-logo';
	const isBrandFaviconDialogOpen = searchParams.get('edit_setting') === 'brand-favicon';

	const { getSetting, loading } = useSettings();

	const brandNameSetting = getSetting(SettingName.BRAND_NAME);
	const brandLogoSetting = getSetting(SettingName.BRAND_LOGO);
	const brandFaviconSetting = getSetting(SettingName.BRAND_FAVICON);

	const handleClickSettingButton = (settingName: string) => () => { 
		const params = new URLSearchParams(searchParams);
		params.set('edit_setting', settingName);
		router.push(`${ pathname }?${ params.toString() }`);
	};

	return (
		<>
			<ButtonList>
				<ButtonItem
					isLoading={ loading === 'pending' }
					value={ loading === 'pending' ? '' : brandLogoSetting && brandLogoSetting.value && brandLogoSetting.value.url ? 'Update the logo' : 'Upload a logo' } 
					onClick={ handleClickSettingButton('brand-logo') }
				>
					{
						brandLogoSetting && brandLogoSetting.value?.url ?
							<div className="w-32 h-10 relative">
								<Image
									alt="Brand logo"
									className="object-contain"
									src={ brandLogoSetting.value.url }
									fill
								/>
							</div>
							: 'Logo'
					}
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
					isLoading={ loading === 'pending' }
					value={
						loading === 'pending' ? '' : brandFaviconSetting && brandFaviconSetting.value && brandFaviconSetting.value.url ?
							(
								<div className="w-4 h-4 relative">
									<Image
										alt="Brand logo"
										className="object-contain"
										src={ brandFaviconSetting.value.url }
										fill
									/>
								</div>
							)
							: 'Upload a favicon'
					}
					onClick={ handleClickSettingButton('brand-favicon') }
				>
					Favicon
				</ButtonItem>
			</ButtonList>
			<BrandNameFormDialog isOpen={ isBrandNameDialogOpen } />
			<BrandLogoFormDialog isOpen={ isBrandLogoDialogOpen } />
			<BrandFaviconFormDialog isOpen={ isBrandFaviconDialogOpen } />
		</>
	);
};

export default BrandSettingsForm;