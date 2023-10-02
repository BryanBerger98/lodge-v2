import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import HeaderProvider from '@/components/layout/Header';
import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserById } from '@/database/user/user.repository';
import authOptions from '@/lib/auth';
import { connectToDatabase } from '@/lib/database';
import { SETTING_NAMES } from '@/utils/settings';

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

	const userVerifyEmailSetting = await findSettingByName(SETTING_NAMES.USER_VERIFY_EMAIL_SETTING);

	if ((!userVerifyEmailSetting && !currentUser?.has_email_verified) || (userVerifyEmailSetting && userVerifyEmailSetting.data_type === 'boolean' && userVerifyEmailSetting.value && !currentUser?.has_email_verified)) {
		redirect('/verify-email');
	}

	const shareWithAdminSetting = await findSettingByName(SETTING_NAMES.SHARE_WITH_ADMIN_SETTING);

	const hasSettingsAccess = currentUser?.role === 'owner' || (shareWithAdminSetting?.data_type === 'boolean' && shareWithAdminSetting?.value);

	const brandNameSetting = await findSettingByName('brand_name');
	const bandName: string = brandNameSetting && brandNameSetting.data_type === 'string' ? brandNameSetting.value : 'Lodge';

	const brandLogoSetting = await findSettingByName('brand_logo');
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