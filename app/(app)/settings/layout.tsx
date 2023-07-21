import { ReactNode } from 'react';

import { findSettingByName } from '@/database/setting/setting.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

type SettingsLayoutProps = {
	children: ReactNode;
};

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {

	const shareWithAdminSetting = await findSettingByName(SHARE_WITH_ADMIN_SETTING);

	const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

	await setServerAuthGuard({
		rolesWhiteList,
		redirect: '/', 
	});

	return (
		<>
			{ children }
		</>
	);
};

export default SettingsLayout;