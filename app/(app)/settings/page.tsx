import { Database, KeyRound, Settings, Unlock, Unplug, Users } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsProvider from '@/context/settings';
import { findOwnerUser } from '@/database/user/user.repository';
import { getCsrfToken } from '@/utils/csrf.util';
const DynamicShareSettings = nextDynamic(() => import('./_components/ShareSettings'));
const DynamicUsersSettings = nextDynamic(() => import('./_components/UsersManagementSettings'));

export const dynamic = 'force-dynamic';

const SettingsPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	const ownerUser = await findOwnerUser();

	return (
		<>
			<PageTitle><Settings /> Settings</PageTitle>
			<SettingsProvider>
				<Tabs
					className="flex gap-4"
					defaultValue="access"
				>
					<TabsList className="flex flex-col h-fit min-w-[220px]">
						<TabsTrigger
							className="gap-2 w-full justify-start"
							value="access"
						><Unlock size="16" /> Access
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full justify-start"
							value="users"
						><Users size="16" /> Users
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full justify-start"
							value="auth"
							disabled
						><KeyRound size="16" /> Authentication
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full justify-start"
							value="env"
							disabled
						><Database size="16" /> Environment
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full justify-start"
							value="integrations"
							disabled
						><Unplug size="16" /> Integrations
						</TabsTrigger>
					</TabsList>
					<div className="grid grid-cols-3">
						<TabsContent
							className="col-span-2 flex flex-col gap-8 mt-0"
							value="access"
						>
							<h2 className="text-xl font-semibold flex gap-2 items-center"><Unlock size="16" /> Access settings</h2>
							<DynamicShareSettings
								csrfToken={ csrfToken }
								ownerUser={ ownerUser }
							/>
						</TabsContent>
						<TabsContent
							className="col-span-2 flex flex-col gap-8 mt-0"
							value="users"
						>
							<h2 className="text-xl font-semibold flex gap-2 items-center"><Users size="16" /> Users settings</h2>
							<DynamicUsersSettings csrfToken={ csrfToken } />
						</TabsContent>
					</div>
				</Tabs>
				
			</SettingsProvider>
		</>
	);
};

export default SettingsPage;