import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { SettingName } from '@/schemas/setting';

type VerifyEmailLayoutProps = {
	children: ReactNode;
};

const VerifyEmailLayout = async ({ children }: VerifyEmailLayoutProps) => {

	await connectToDatabase();

	const userEmailVerifySetting = await findSettingByName(SettingName.USER_VERIFY_EMAIL);

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
