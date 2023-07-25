import { Database, KeyRound, Mail, Settings, Unlock, Unplug, Users } from 'lucide-react';
import { default as nextDynamic } from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsProvider from '@/context/settings';
import { findOwnerUser } from '@/database/user/user.repository';
import { getCsrfToken } from '@/utils/csrf.util';
const DynamicShareSettings = nextDynamic(() => import('./_components/ShareSettings'));
const DynamicUsersSettings = nextDynamic(() => import('./_components/UsersManagementSettings'));
const DynamicPasswordSettings = nextDynamic(() => import('./_components/AuthSettings/PasswordSettings'));

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
					<TabsList className="flex flex-col h-fit min-w-[220px] bg-transparent">
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="access"
						><Unlock size="16" /> Access
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="users"
						><Users size="16" /> Users
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="auth"
						><KeyRound size="16" /> Authentication
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="env"
							disabled
						><Database size="16" /> Environment
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="integrations"
							disabled
						><Unplug size="16" /> Integrations
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 w-full py-2 text-slate-900 justify-start data-[state=active]:bg-muted hover:bg-muted"
							value="emails"
							disabled
						><Mail size="16" /> Emails
						</TabsTrigger>
					</TabsList>
					<TabsContent
						className="grid grid-cols-3"
						value="access"
					>
						<div className="col-span-2 flex flex-col gap-8 mt-0">
							<h2 className="text-xl font-semibold flex gap-2 items-center"><Unlock size="16" /> Settings access</h2>
							<DynamicShareSettings
								csrfToken={ csrfToken }
								ownerUser={ ownerUser }
							/>
						</div>
							
					</TabsContent>
					<TabsContent
						className="grid grid-cols-3"
						value="users"
					>
						<div className="col-span-2 flex flex-col gap-8 mt-0">
							<h2 className="text-xl font-semibold flex gap-2 items-center"><Users size="16" /> Users settings</h2>
							<DynamicUsersSettings csrfToken={ csrfToken } />
						</div>
					</TabsContent>
					<TabsContent
						className="grid grid-cols-3"
						value="auth"
					>
						<div className="col-span-2 flex flex-col gap-8 mt-0">
							<h2 className="text-xl font-semibold flex gap-2 items-center"><Users size="16" /> Authentication settings</h2>
							<DynamicPasswordSettings csrfToken={ csrfToken } />
						</div>
					</TabsContent>
				</Tabs>
				
			</SettingsProvider>
		</>
	);
};

export default SettingsPage;