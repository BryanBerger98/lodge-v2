import { ChevronLeft, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import PageTitle from '@/components/layout/Header/PageTitle';
import BackButton from '@/components/ui/Button/BackButton';
import { updateFileURL } from '@/database/file/file.repository';
import { findUserById } from '@/database/user/user.repository';
import { getFieldSignedURL } from '@/lib/bucket';
import { getCsrfToken } from '@/lib/csrf';
import { UserPopulatedSchema } from '@/schemas/user/populated.schema';

import UsersProvider from '../_context/users/users.provider';

const EditUserForm = dynamic(() => import('../_components/EditUserForm'));
const DynamicMenu = dynamic(() => import('./_components/Menu'));

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

	if (userData.photo && userData.photo.url_expiration_date && userData.photo.url_expiration_date < new Date()) {
		const photoUrl = await getFieldSignedURL(userData.photo.key, 24 * 60 * 60);
		const updatedFile = await updateFileURL({
			id: userData.photo.id,
			url: photoUrl,
		});
		userData.photo = updatedFile;
	}

	const parsedUserData = UserPopulatedSchema.parse(userData);

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
						<EditUserForm
							csrfToken={ csrfToken }
							user={ parsedUserData }
						/>
					</div>
				</div>
			</UsersProvider>
		</>
	);
};

export default EditUserPage;