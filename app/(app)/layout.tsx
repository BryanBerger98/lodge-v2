import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import HeaderProvider from '@/components/layout/Header';
import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserById } from '@/database/user/user.repository';
import authOptions from '@/lib/auth';
import { connectToDatabase } from '@/lib/database';
import { UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingImagePopulatedSchema, UnregisteredSettingStringPopulatedSchema } from '@/schemas/setting';
import { SettingName } from '@/schemas/setting/name.shema';

const Sidebar = dynamic(() => import('@/components/layout/Sidebar'));

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProps) => {

	await connectToDatabase();

	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/signin');
	}

	const currentUser = await findUserById(session?.user.id);

	if (!currentUser) {
		redirect('/signin');
	}

	const userVerifyEmailSettingData = await findSettingByName(SettingName.USER_VERIFY_EMAIL);
	const userVerifyEmailSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userVerifyEmailSettingData);

	if ((!userVerifyEmailSetting && !currentUser?.has_email_verified) || (userVerifyEmailSetting && userVerifyEmailSetting.value && !currentUser?.has_email_verified)) {
		redirect('/verify-email');
	}

	const shareWithAdminSettingData = await findSettingByName(SettingName.SHARE_WITH_ADMIN);
	const shareWithAdminSetting = UnregisteredSettingBooleanPopulatedSchema.parse(shareWithAdminSettingData);

	const hasSettingsAccess = currentUser?.role === 'owner' || shareWithAdminSetting?.value;

	const brandNameSettingData = await findSettingByName(SettingName.BRAND_NAME);
	const brandNameSetting = UnregisteredSettingStringPopulatedSchema.parse(brandNameSettingData);
	const bandName: string = brandNameSetting.value;

	const brandLogoSettingData = await findSettingByName(SettingName.BRAND_LOGO);
	const brandLogoSetting = UnregisteredSettingImagePopulatedSchema.parse(brandLogoSettingData);
	const brandLogo: string = brandLogoSetting?.value?.url || '';

	return (
		<HeaderProvider>
			<Sidebar
				brandName={ bandName }
				hasSettingsAccess={ hasSettingsAccess }
				logoUrl={ brandLogo }
			/>
			<div className="ml-0 md:ml-[200px] container !w-auto p-4 lg:p-8">
				{ children }
			</div>
		</HeaderProvider>
	);
};

export default AppLayout;