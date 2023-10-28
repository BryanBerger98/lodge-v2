import { AlertTriangle } from 'lucide-react';

import ButtonList from '@/components/ui/Button/ButtonList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading4 } from '@/components/ui/Typography/heading';
import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema } from '@/schemas/setting';
import { setServerAuthGuard } from '@/utils/auth';

import DeleteAccountButton from '../_components/danger-zone/DeleteAccountButton';
import LogOutButton from '../_components/danger-zone/LogOutButton';

const AccountDangerZonePage = async () => {

	await connectToDatabase();
	const { user: currentUser } = await setServerAuthGuard();

	const userAccountDeletionSettingData = await findSettingByName(SettingName.USER_ACCOUNT_DELETION);
	const userAccountDeletionSetting = UnregisteredSettingBooleanPopulatedSchema.parse(userAccountDeletionSettingData);

	const canDeleteAccount = userAccountDeletionSetting && userAccountDeletionSetting.value;

	return (
		<>
			<Heading4 className="gap-2 flex items-center text-destructive"><AlertTriangle size="16" />Danger zone</Heading4>
			<Card>
				<CardHeader>
					<CardTitle className="text-destructive">Danger zone</CardTitle>
					<CardDescription>Be careful in this area.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ButtonList className="w-full">
						<LogOutButton />
						{ canDeleteAccount && currentUser.role !== Role.OWNER ? <DeleteAccountButton /> : null }
					</ButtonList>
				</CardContent>
			</Card>
		</>
	);
};

export default AccountDangerZonePage;