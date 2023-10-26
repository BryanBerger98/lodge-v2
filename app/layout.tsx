import './globals.css';

import { Metadata } from 'next';

import PageProgressBar from '@/components/layout/PageProgressBar';
import { Toaster } from '@/components/ui/toaster';
import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { ImageMimeType } from '@/schemas/file/mime-type.schema';
import { SettingName } from '@/schemas/setting/name.shema';

import Providers from './_components/Providers';

export const generateMetadata = async (): Promise<Metadata> => {
	
	await connectToDatabase();

	const brandNameSetting = await findSettingByName(SettingName.BRAND_NAME);
	const brandFaviconSetting = await findSettingByName(SettingName.BRAND_LOGO);
	const brandFaviconMimeType = brandFaviconSetting?.value && 'mime_type' in brandFaviconSetting?.value ? brandFaviconSetting?.value?.mime_type : ImageMimeType.SVG;

	return {
	  title: brandNameSetting && brandNameSetting.data_type === 'string' ? brandNameSetting.value : 'Lodge',
	  description: 'Next.js starter app',
	  icons: [
			{
				url: brandFaviconSetting?.value?.url || '/lodge.svg',
				rel: 'icon',
				sizes: '16x16',
				type: brandFaviconMimeType,
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
