'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import PageHeader from '@/components/layout/PageHeader';
import PageHeaderTitle from '@/components/layout/PageHeader/PageHeaderTitle';
import SidebarToggleButton from '@/components/layout/Sidebar/SidebarToggleButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

const SettingsHeader = () => {

	const pathname = usePathname();
	const [ , subpath = '' ] = pathname.split('/').filter(el => el) || [ 'settings', '' ];

	const getSubpathTitle = () => {
		switch (subpath) {
			case 'access':
				return 'Access';
			case 'users':
				return 'Users';
			case 'auth':
				return 'Authentication';
			case 'environment':
				return 'Environment';
			case 'integrations':
				return 'Integrations';
			case 'email':
				return 'Email';
			case 'website':
				return 'Website';
			case 'branding':
				return 'Branding';
			default:
				return null;
		}
	};

	return (
		<>
			<PageHeader>
				<SidebarToggleButton />
				<PageHeaderTitle>
					<Settings /> Settings
				</PageHeaderTitle>
			</PageHeader>
			<Breadcrumb className="mb-4 hidden md:block">
				<BreadcrumbItem>
					<BreadcrumbLink
						as={ Link }
						className="flex items-center gap-2"
						href="/settings"
					>
						<Settings className="w-4 h-4" />
						Settings
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink
						as={ Link }
						href={ `/settings/${ subpath }` }
					>
						{ getSubpathTitle() }
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
		</>
	);
};

export default SettingsHeader;