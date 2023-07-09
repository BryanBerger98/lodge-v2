import { ChevronLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';

import EditUserForm from '../_components/EditUserForm';

const CreateUserPage = () => {

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
					<EditUserForm />
				</div>
			</div>
		</>
	);
};

export default CreateUserPage;