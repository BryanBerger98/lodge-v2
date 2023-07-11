import { ChevronLeft, User } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import PageTitle from '@/components/layout/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import { Id } from '@/config/database.config';
import UsersProvider from '@/context/users';
import { findFileByKey } from '@/database/file/file.repository';
import { findUserById } from '@/database/user/user.repository';
import { getFileFromKey } from '@/lib/bucket';
import { getCsrfToken } from '@/utils/csrf.util';

import EditUserForm from '../../_components/EditUserForm';

type EditUserPageProps = {
	params: {
		userId: string | Id;
	}
};

const EditUserPage = async ({ params }: EditUserPageProps) => {

	const csrfToken = await getCsrfToken(headers());

	const { userId } = params;

	if (!userId) {
		redirect('/users');
	}

	const userData = await findUserById(userId);

	if (!userData) {
		redirect('/users');
	}

	if (userData.photo_key) {
		const photoFileObject = await findFileByKey(userData.photo_key);
		userData.photo_url = photoFileObject ? await getFileFromKey(photoFileObject) : null;
	}

	return (
		<>
			<PageTitle><User /> Edit user</PageTitle>
			<BackButton>
				<ChevronLeft /> Back
			</BackButton>
			<UsersProvider>
				<div className="grid grid-cols-3">
					<div className="col-span-2 flex flex-col gap-8">
						<EditUserForm
							csrfToken={ csrfToken }
							user={ userData }
						/>
					</div>
				</div>
			</UsersProvider>
		</>
	);
};

export default EditUserPage;