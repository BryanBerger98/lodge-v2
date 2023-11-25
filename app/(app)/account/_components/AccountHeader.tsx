'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import PageHeader from '@/components/layout/PageHeader';
import PageHeaderTitle from '@/components/layout/PageHeader/PageHeaderTitle';
import SidebarToggleButton from '@/components/layout/Sidebar/SidebarToggleButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

const AccountHeader = () => {

	const pathname = usePathname();
	const [ , subpath = '' ] = pathname.split('/').filter(el => el) || [ 'account', '' ];

	const getSubpathTitle = () => {
		switch (subpath) {
			case '':
				return 'Profile';
			case 'security':
				return 'Security';
			case 'danger-zone':
				return 'Danger zone';
			default:
				return null;
		}
	};

	return (
		<>
			<PageHeader>
				<SidebarToggleButton />
				<PageHeaderTitle>
					<User /> Account
				</PageHeaderTitle>
			</PageHeader>
			<Breadcrumb className="mb-4 hidden md:block">
				<BreadcrumbItem>
					<BreadcrumbLink
						as={ Link }
						className="flex items-center gap-2"
						href="/account"
					>
						<User className="w-4 h-4" />
						Account
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink
						as={ Link }
						href={ `/account/${ subpath }` }
					>
						{ getSubpathTitle() }
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
		</>
	);
};

export default AccountHeader;