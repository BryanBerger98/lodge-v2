import { ChevronLeft, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import PageTitle from '@/components/layout/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import UsersProvider from '@/context/users';
import { findFileByKey } from '@/database/file/file.repository';
import { findUserById } from '@/database/user/user.repository';
import { getFileFromKey } from '@/lib/bucket';
import { getCsrfToken } from '@/lib/csrf';
import { Id } from '@/lib/database';


const DynamicEditUserForm = dynamic(() => import('../../_components/EditUserForm'));
const DynamicMenu = dynamic(() => import('../_components/Menu'));

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
			<UsersProvider>
				<div className="grid gird-cols-1 lg:grid-cols-3">
					<div className="col-span-2 flex flex-col gap-8">
						<div className="flex justify-between items-center">
							<BackButton className="mb-0">
								<ChevronLeft /> Back
							</BackButton>
							<DynamicMenu
								csrfToken={ csrfToken }
								userData={ userData }
							/>
						</div>
						<DynamicEditUserForm
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