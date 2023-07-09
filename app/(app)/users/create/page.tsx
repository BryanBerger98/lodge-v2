import { ChevronLeft, UserPlus } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { getCsrfToken } from '@/utils/csrf.util';

import EditUserForm from '../_components/EditUserForm';

const CreateUserPage = async () => {

	const csrfToken = await getCsrfToken(headers());

	return (
		<>
			<PageTitle><UserPlus /> Create user</PageTitle>
			<Button
				className="gap-2 items-center mb-4"
				variant="outline"
				asChild
			>
				<Link href="/users">
					<ChevronLeft /> Back
				</Link>
			</Button>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col gap-8">
					<EditUserForm csrfToken={ csrfToken } />
				</div>
			</div>
		</>
	);
};

export default CreateUserPage;