import { ChevronLeft, UserPlus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import PageTitle from '@/components/layout/Header/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import CsrfProvider from '@/context/csrf/csrf.provider';
import UserProvider from '@/context/users/user/user.provider';
import { getCsrfToken } from '@/lib/csrf';

const UserForm = dynamic(() => import('../_components/UserForm'));

const CreateUserPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<CsrfProvider csrfToken={ csrfToken }>
			<PageTitle><UserPlus /> Create user</PageTitle>
			<BackButton>
				<ChevronLeft /> Back
			</BackButton>
			<UserProvider user={ null }>
				<div className="grid gird-cols-1 lg:grid-cols-3">
					<div className="lg:col-span-2 flex flex-col gap-8">
						<UserForm />
					</div>
				</div>
			</UserProvider>
		</CsrfProvider>
	);
};

export default CreateUserPage;