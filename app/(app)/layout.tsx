import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import { connectToDatabase } from '@/config/database.config';
import HeaderProvider from '@/context/layout/header';
import { findSettingByName } from '@/database/setting/setting.repository';
import { findUserById } from '@/database/user/user.repository';
import authOptions from '@/utils/auth/auth-options';
import { SHARE_WITH_ADMIN_SETTING, USER_VERIFY_EMAIL_SETTING } from '@/utils/settings';

const DynamicSidebar = dynamic(() => import('@/components/layout/Sidebar'));

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

	const userVerifyEmailSetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);

	if ((!userVerifyEmailSetting && !currentUser?.has_email_verified) || (userVerifyEmailSetting && userVerifyEmailSetting.data_type === 'boolean' && userVerifyEmailSetting.value && !currentUser?.has_email_verified)) {
		redirect('/verify-email');
	}

	const shareWithAdminSetting = await findSettingByName(SHARE_WITH_ADMIN_SETTING);

	const hasSettingsAccess = currentUser?.role === 'owner' || (shareWithAdminSetting?.data_type === 'boolean' && shareWithAdminSetting?.value);

	return (
		<HeaderProvider>
			<DynamicSidebar hasSettingsAccess={ hasSettingsAccess } />
			<div className="ml-0 md:ml-[200px] container !w-auto p-4 lg:p-8">
				{ children }
			</div>
		</HeaderProvider>
	);
};

export default AppLayout;