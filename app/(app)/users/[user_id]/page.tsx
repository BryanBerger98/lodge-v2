import { ChevronLeft, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { renewFileExpiration } from '@/app/_utils/file/renew-file-expiration';
import PageTitle from '@/components/layout/Header/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import CsrfProvider from '@/context/csrf/csrf.provider';
import UserProvider from '@/context/users/user/user.provider';
import { findUserById } from '@/database/user/user.repository';
import { getCsrfToken } from '@/lib/csrf';
import { UserPopulatedSchema } from '@/schemas/user/populated.schema';

import UsersProvider from '../_context/users/users.provider';

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
			<PageTitle><User /> Edit user</PageTitle>
			<CsrfProvider csrfToken={ csrfToken }>
				<UsersProvider>
					<UserProvider user={ parsedUserData }>
						<div className="grid gird-cols-1 lg:grid-cols-3">
							<div className="col-span-2 space-y-8">
								<BackButton className="mb-0">
									<ChevronLeft /> Back
								</BackButton>
								<UserHeader />
								<UserForm />
							</div>
						</div>
					</UserProvider>
				</UsersProvider>
			</CsrfProvider>
		</>
	);
};

export default EditUserPage;