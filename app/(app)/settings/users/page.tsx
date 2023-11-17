import { Users } from 'lucide-react';

import { Heading2 } from '@/components/ui/Typography/heading';
import { Paragraph } from '@/components/ui/Typography/text';
import { findSettingByName } from '@/database/setting/setting.repository';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema } from '@/schemas/setting';

import AllowNewUsersToSignUpSetting from './_components/AllowNewUsersToSignUpSetting';
import AllowUsersMultipleAccountsSetting from './_components/AllowUsersMultipleAccountsSetting';
import AllowUsersToDeleteTheirAccountSetting from './_components/AllowUsersToDeleteTheirAccountSetting';
import EmailVerificationSetting from './_components/EmailVerificationSetting';

export const dynamic = 'force-dynamic';

const UsersSettingsPage = async () => {

	const newUserSignUpSettingData = await findSettingByName(SettingName.NEW_USERS_SIGNUP);
	// const userVerifyEmailSettingData = await findSettingByName(SettingName.USER_VERIFY_EMAIL);
	// const userAccountDeletionSettingData = await findSettingByName(SettingName.USER_ACCOUNT_DELETION);

	const newUserSignUpSetting = UnregisteredSettingBooleanPopulatedSchema.parse(newUserSignUpSettingData);
	// const userVerifyEmailSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userVerifyEmailSettingData);
	// const userAccountDeletionSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userAccountDeletionSettingData);

	return (
		<div className="w-1/2 flex flex-col gap-8 mt-0">
			<Heading2 className="flex gap-2 items-center"><Users /> Users settings</Heading2>
			<div className="space-y-4">
				<Paragraph variant="lead">Accounts settings</Paragraph>
				<AllowNewUsersToSignUpSetting initialValue={ newUserSignUpSetting } />
				<EmailVerificationSetting />
				<AllowUsersToDeleteTheirAccountSetting />
				<AllowUsersMultipleAccountsSetting />
			</div>
			{ /* <UsersSettings /> */ }
		</div>
	);
};

export default UsersSettingsPage;