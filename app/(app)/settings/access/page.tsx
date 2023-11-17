import { Unlock } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';
import { z } from 'zod';

import { Paragraph } from '@/components/ui/Typography/text';
import CsrfProvider from '@/context/csrf/csrf.provider';
import { findSettingByName } from '@/database/setting/setting.repository';
import { findOwnerUser, findUsers } from '@/database/user/user.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';
import { Role } from '@/schemas/role.schema';
import { SettingName } from '@/schemas/setting';
import { UserSchema } from '@/schemas/user';

const ShareWithAdminSetting = nextDynamic(() => import('./_components/ShareWithAdminSetting'));
const OwnerSetting = nextDynamic(() => import('./_components/OwnerSetting'));

export const dynamic = 'force-dynamic';

const AccessSettingsPage = async () => {

	await connectToDatabase();

	const csrfToken = await getCsrfToken(headers());

	const ownerUser = await findOwnerUser();
	const parsedOwnerUser = UserSchema.or(z.null()).parse(ownerUser);

	const shareWithAdminSetting = await findSettingByName(SettingName.SHARE_WITH_ADMIN);
	const shareWithAdminUsersListSetting = shareWithAdminSetting && shareWithAdminSetting.value === 'share_admin_selection' ? await findSettingByName(SettingName.SHARE_WITH_ADMIN_USERS_LIST) : null;
	const selectedAdminUsers = shareWithAdminUsersListSetting ? await findUsers({
		role: Role.ADMIN,
		_id: { $in: shareWithAdminUsersListSetting.value }, 
	}) : [];

	return (
		<CsrfProvider csrfToken={ csrfToken }>
			<div className="w-1/2 space-y-8 mt-0">
				<h2 className="text-xl font-semibold flex gap-2 items-center"><Unlock size="16" /> Access settings</h2>
				<div className="space-y-4">
					<Paragraph variant="lead">Share settings</Paragraph>
					<div className="rounded-lg border p-4 mb-4 space-y-4">
						<div className="flex flex-col">
							<Paragraph variant="medium">Share with admin</Paragraph>
							<Paragraph variant="muted">Allow admin users to have access to the settings panel.</Paragraph>
						</div>
						<ShareWithAdminSetting selectedAdminUsers={ selectedAdminUsers } />
					</div>
					<OwnerSetting ownerUser={ parsedOwnerUser } />
				</div>
			</div>
		</CsrfProvider>
	);
};

export default AccessSettingsPage;