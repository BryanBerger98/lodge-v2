import { Home } from 'lucide-react';
import Link from 'next/link';

import PageHeader from '@/components/layout/PageHeader';
import PageHeaderTitle from '@/components/layout/PageHeader/PageHeaderTitle';
import SidebarToggleButton from '@/components/layout/Sidebar/SidebarToggleButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

const AppPage = () => {

	return (
		<>
			<PageHeader>
				<SidebarToggleButton />
				<PageHeaderTitle>
					<Home /> Dashboard
				</PageHeaderTitle>
			</PageHeader>
			<Breadcrumb className="mb-4 hidden md:block">
				<BreadcrumbItem>
					<BreadcrumbLink
						as={ Link }
						className="flex items-center gap-2"
						href="/"
					>
						<Home className="w-4 h-4" />
						Dashboard
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
			<p className="text-slate-500">Here will be the dashboard page.</p>
		</>
	);
};

export default AppPage;