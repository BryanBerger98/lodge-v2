import { Database, Globe, KeyRound, Mail, Settings, Star, Unlock, Unplug, Users } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';

import PageTitle from '@/components/layout/Header/PageTitle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import CsrfProvider from '@/context/csrf/csrf.provider';
import SettingsProvider from '@/context/settings/settings.provider';
import { findSettingByName } from '@/database/setting/setting.repository';
import { getCsrfToken } from '@/lib/csrf';
import { connectToDatabase } from '@/lib/database';
import { setServerAuthGuard } from '@/utils/auth';
import { SETTING_NAMES } from '@/utils/settings';

type SettingsLayoutProps = {
	children: ReactNode;
};

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {

	const [ , subpath ] = headers().get('x-pathname')?.split('/').filter(el => el) || [];

	const csrfToken = await getCsrfToken(headers());

	await connectToDatabase();

	const shareWithAdminSetting = await findSettingByName(SETTING_NAMES.SHARE_WITH_ADMIN_SETTING);

	const rolesWhiteList: ('admin' | 'owner')[] = shareWithAdminSetting && shareWithAdminSetting.value ? [ 'owner', 'admin' ] : [ 'owner' ];

	await setServerAuthGuard({
		rolesWhiteList,
		redirect: '/', 
	});

	return (
		<>
			<PageTitle><Settings /> Settings</PageTitle>
			<div className="flex flex-col lg:flex-row gap-4">
				<Tabs
					className="h-full"
					defaultValue={ subpath || 'access' }
					orientation="vertical"
				>
					<TabsList className="bg-transparent flex-row lg:flex-col !justify-start h-full lg:overflow-x-auto lg:min-w-[220px] items-start !gap-0">
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="access"
							variant="secondary"
							asChild
						>
							<Link href="/settings/access"><Unlock size="16" /> Access</Link>
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="users"
							variant="secondary"
							asChild
						>
							<Link href="/settings/users"><Users size="16" /> Users</Link>
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="auth"
							variant="secondary"
							asChild
						>
							<Link href="/settings/auth"><KeyRound size="16" /> Authentication</Link>
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="environment"
							variant="secondary"
							disabled
						><Database size="16" /> Environment
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="integrations"
							variant="secondary"
							disabled
						><Unplug size="16" /> Integrations
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="email"
							variant="secondary"
							disabled
						><Mail size="16" /> Email
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="email"
							variant="secondary"
							disabled
						><Globe size="16" /> Website
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="email"
							variant="secondary"
							asChild
						>
							<Link href="/settings/branding"><Star size="16" /> Branding</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<SettingsProvider>
					<CsrfProvider csrfToken={ csrfToken }>
						{ children }
					</CsrfProvider>
				</SettingsProvider>
			</div>
		</>
	);
};

export default SettingsLayout;