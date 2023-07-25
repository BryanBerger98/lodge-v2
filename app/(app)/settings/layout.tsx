import { Database, KeyRound, Mail, Unlock, Unplug, Users } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';

import Tabs from '@/components/ui/Tabs';
import TabButton from '@/components/ui/Tabs/TabButton';
import TabsList from '@/components/ui/Tabs/TabsList';
import { connectToDatabase } from '@/config/database.config';
import SettingsProvider from '@/context/settings';
import { findSettingByName } from '@/database/setting/setting.repository';
import { setServerAuthGuard } from '@/utils/auth';
import { SHARE_WITH_ADMIN_SETTING } from '@/utils/settings';

type SettingsLayoutProps = {
	children: ReactNode;
	url: string;
};

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {

	const [ , subpath ] = headers().get('x-pathname')?.split('/').filter(el => el) || [];

	await connectToDatabase();

	const shareWithAdminSetting = await findSettingByName(SHARE_WITH_ADMIN_SETTING);

	const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

	await setServerAuthGuard({
		rolesWhiteList,
		redirect: '/', 
	});

	return (
		<div className="flex gap-4">
			<Tabs
				defaultValue={ subpath || 'access' }
			>
				<TabsList className="bg-transparent flex-col !justify-start min-w-[220px] items-start !gap-0 text-slate-900">
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="access"
						asChild
					>
						<Link href="/settings/access"><Unlock size="16" /> Access</Link>
					</TabButton>
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="users"
						asChild
					>
						<Link href="/settings/users"><Users size="16" /> Users</Link>
					</TabButton>
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="auth"
						asChild
					>
						<Link href="/settings/auth"><KeyRound size="16" /> Authentication</Link>
					</TabButton>
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="environment"
						disabled
					><Database size="16" /> Environment
					</TabButton>
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="integrations"
						disabled
					><Unplug size="16" /> Integrations
					</TabButton>
					<TabButton
						className="gap-2 items-center w-full justify-start"
						value="email"
						disabled
					><Mail size="16" /> Email
					</TabButton>
				</TabsList>
			</Tabs>
			<SettingsProvider>
				{ children }
			</SettingsProvider>
		</div>
	);
};

export default SettingsLayout;