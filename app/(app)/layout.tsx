import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import SidebarProvider from '@/components/layout/Sidebar/SidebarProvider';
import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingImagePopulatedSchema, UnregisteredSettingStringPopulatedSchema } from '@/schemas/setting';
import { SettingName } from '@/schemas/setting/name.shema';
import { getServerCurrentUser } from '@/utils/auth';

import { hasSettingsAccess } from '../_utils/settings/has-settings-access';

const Sidebar = dynamic(() => import('@/components/layout/Sidebar'));

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProps) => {

	await connectToDatabase();

	const currentUser = await getServerCurrentUser();

	if (!currentUser) {
		redirect('/signin');
	}

	const userVerifyEmailSettingData = await findSettingByName(SettingName.USER_VERIFY_EMAIL);
	const userVerifyEmailSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userVerifyEmailSettingData);

	if ((!userVerifyEmailSetting && !currentUser?.has_email_verified) || (userVerifyEmailSetting && userVerifyEmailSetting.value && !currentUser?.has_email_verified)) {
		redirect('/verify-email');
	}

	const brandNameSettingData = await findSettingByName(SettingName.BRAND_NAME);
	const brandNameSetting = UnregisteredSettingStringPopulatedSchema.parse(brandNameSettingData);
	const bandName: string = brandNameSetting.value;

	const brandLogoSettingData = await findSettingByName(SettingName.BRAND_LOGO);
	const brandLogoSetting = UnregisteredSettingImagePopulatedSchema.parse(brandLogoSettingData);
	const brandLogo: string = brandLogoSetting?.value?.url || '';

	const hasUserSettingsAccess = await hasSettingsAccess(currentUser);

	return (
		<SidebarProvider
			brandName={ bandName }
			hasSettingsAccess={ hasUserSettingsAccess }
			logoUrl={ brandLogo }
		>
			<Sidebar/>
			<div className="ml-0 md:ml-[248px] p-4 lg:p-8">
				{ children }
			</div>
		</SidebarProvider>
	);
};

export default AppLayout;