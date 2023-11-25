import { User, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import PageHeader from '@/components/layout/PageHeader';
import PageHeaderTitle from '@/components/layout/PageHeader/PageHeaderTitle';
import SidebarToggleButton from '@/components/layout/Sidebar/SidebarToggleButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import CsrfProvider from '@/context/csrf/csrf.provider';
import UserProvider from '@/context/users/user/user.provider';
import { findUserById } from '@/database/user/user.repository';
import { getCsrfToken } from '@/lib/csrf';
import { UserPopulatedSchema } from '@/schemas/user/populated.schema';

const UserHeader = dynamic(() => import('./_components/UserHeader'));
const UserForm = dynamic(() => import('../_components/UserForm'));

type EditUserPageProps = {
	params: {
		user_id: string;
	}
};

const EditUserPage = async ({ params }: EditUserPageProps) => {

	const csrfToken = await getCsrfToken(headers());

	const { user_id } = params;

	if (!user_id) {
		redirect('/users');
	}

	const userData = await findUserById(user_id);

	if (!userData) {
		redirect('/users');
	}

	userData.photo = await renewFileExpiration(userData.photo);

	const parsedUserData = UserPopulatedSchema.parse(userData);

	return (
		<>
			<PageHeader>
				<SidebarToggleButton />
				<PageHeaderTitle>
					<User /> 
					{ parsedUserData.first_name && parsedUserData.last_name ? `${ parsedUserData.first_name } ${ parsedUserData.last_name }` : parsedUserData.username ? parsedUserData.username : parsedUserData.email }
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
						href={ `/users/${ parsedUserData.id }` }
					>
						{ parsedUserData.first_name && parsedUserData.last_name ? `${ parsedUserData.first_name } ${ parsedUserData.last_name }` : parsedUserData.username ? parsedUserData.username : parsedUserData.email }
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
			<CsrfProvider csrfToken={ csrfToken }>
				<UserProvider user={ parsedUserData }>
					<div className="grid gird-cols-1 lg:grid-cols-3">
						<div className="col-span-2 space-y-8">
							<UserHeader />
							<UserForm />
						</div>
					</div>
				</UserProvider>
			</CsrfProvider>
		</>
	);
};

export default EditUserPage;