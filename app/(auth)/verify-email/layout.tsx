import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { connectToDatabase } from '@/config/database.config';
import { findSettingByName } from '@/database/setting/setting.repository';
import { USER_VERIFY_EMAIL_SETTING } from '@/utils/settings';

type VerifyEmailLayoutProps = {
	children: ReactNode;
};

const VerifyEmailLayout = async ({ children }: VerifyEmailLayoutProps) => {

	await connectToDatabase();

	const userEmailVerifySetting = await findSettingByName(USER_VERIFY_EMAIL_SETTING);

	if (userEmailVerifySetting && userEmailVerifySetting.data_type === 'boolean' && !userEmailVerifySetting.value) {
		redirect('/');
	}

	return (
		<>
			{ children }
		</>
	);
};

export default VerifyEmailLayout;