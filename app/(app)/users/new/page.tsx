import { UserPlus, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';

import PageHeader from '@/components/layout/PageHeader';
import PageHeaderTitle from '@/components/layout/PageHeader/PageHeaderTitle';
import SidebarToggleButton from '@/components/layout/Sidebar/SidebarToggleButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import CsrfProvider from '@/context/csrf/csrf.provider';
import UserProvider from '@/context/users/user/user.provider';
import { getCsrfToken } from '@/lib/csrf';

const UserForm = dynamic(() => import('../_components/UserForm'));

const CreateUserPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<CsrfProvider csrfToken={ csrfToken }>
			<PageHeader>
				<SidebarToggleButton />
				<PageHeaderTitle>
					<UserPlus /> New user
				</PageHeaderTitle>
			</PageHeader>
			<Breadcrumb className="mb-4 hidden md:block">
				<BreadcrumbItem>
					<BreadcrumbLink
						as={ Link }
						className="flex items-center gap-2"
						href="/users"
					>
						<Users className="w-4 h-4" />
						Users
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink
						as={ Link }
						href="/users/new"
					>
						New user
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
			<UserProvider user={ null }>
				<div className="grid gird-cols-1 xl:grid-cols-3">
					<div className="xl:col-span-2 flex flex-col gap-8">
						<UserForm />
					</div>
				</div>
			</UserProvider>
		</CsrfProvider>
	);
};

export default CreateUserPage;