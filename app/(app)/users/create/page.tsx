import { ChevronLeft, UserPlus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import UsersProvider from '@/context/users';
import { getCsrfToken } from '@/lib/csrf';


const DynamicEditUserForm = dynamic(() => import('../_components/EditUserForm'));

const CreateUserPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<>
			<PageTitle><UserPlus /> Create user</PageTitle>
			<BackButton>
				<ChevronLeft /> Back
			</BackButton>
			<UsersProvider>
				<div className="grid gird-cols-1 lg:grid-cols-3">
					<div className="lg:col-span-2 flex flex-col gap-8">
						<DynamicEditUserForm csrfToken={ csrfToken } />
					</div>
				</div>
			</UsersProvider>
		</>
	);
};

export default CreateUserPage;