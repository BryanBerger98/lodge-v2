import { AlertTriangle, Lock, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import AuthProvider from '@/context/auth/auth.provider';
import CsrfProvider from '@/context/csrf/csrf.provider';
import { getCsrfToken } from '@/lib/csrf';
import { setServerAuthGuard } from '@/utils/auth';

const AccountHeader = dynamic(() => import('./_components/AccountHeader'));

type AccountLayoutProps = {
	children: ReactNode;
};

const AccountLayout = async ({ children }: AccountLayoutProps) => {

	const [ , subpath ] = headers().get('x-pathname')?.split('/').filter(el => el) || [];

	const csrfToken = await getCsrfToken(headers());

	await setServerAuthGuard();
	
	return (
		<AuthProvider>
			<AccountHeader />
			<div className="flex flex-col lg:flex-row gap-4 w-full">
				<Tabs
					className="h-full p-0 w-full lg:w-fit"
					defaultValue={ subpath || 'profile' }
					orientation="vertical"
				>
					<TabsList className="bg-transparent flex-row lg:flex-col !justify-start h-full overflow-x-scroll w-full lg:w-fit no-scrollbar lg:overflow-x-auto lg:min-w-[220px] items-start !gap-0">
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="profile"
							variant="secondary"
							asChild
						>
							<Link href="/account"><User size="16" /> Profile</Link>
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="security"
							variant="secondary"
							asChild
						>
							<Link href="/account/security"><Lock size="16" /> Security</Link>
						</TabsTrigger>
						<TabsTrigger
							className="gap-2 items-center w-full justify-start"
							value="danger-zone"
							variant="destructive"
							asChild
						>
							<Link href="/account/danger-zone"><AlertTriangle size="16" /> Danger zone</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="flex-1 grid grid-cols-1 xl:grid-cols-3">
					<div className="col-span-1 xl:col-span-2 space-y-8">
						<CsrfProvider csrfToken={ csrfToken }>
							{ children }
						</CsrfProvider>
					</div>
				</div>
			</div>
		</AuthProvider>
	);
};

export default AccountLayout;