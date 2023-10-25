import './globals.css';

import { Metadata } from 'next';

import PageProgressBar from '@/components/layout/PageProgressBar';
import { Toaster } from '@/components/ui/toaster';
import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { SETTING_NAMES } from '@/utils/settings';

import Providers from './_components/Providers';

export const generateMetadata = async (): Promise<Metadata> => {
	
	await connectToDatabase();

	const brandNameSetting = await findSettingByName(SETTING_NAMES.BRAND_NAME_SETTING);
	const brandFaviconSetting = await findSettingByName(SETTING_NAMES.BRAND_FAVICON_SETTING);

	return {
	  title: brandNameSetting && brandNameSetting.data_type === 'string' ? brandNameSetting.value : 'Lodge',
	  description: 'Next.js starter app',
	  icons: [
			{
				url: brandFaviconSetting?.value?.url || '/lodge.svg',
				rel: 'icon',
				sizes: '16x16',
				type: brandFaviconSetting?.value?.mimetype || 'image/svg+xml',
			},
	  ],
	};
};

const RootLayout = ({ children }: {
  children: React.ReactNode
}) => {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<PageProgressBar />
				<Providers>
					{ children }
				</Providers>
				<Toaster />
			</body>
		</html>
	);
};

export default RootLayout;
