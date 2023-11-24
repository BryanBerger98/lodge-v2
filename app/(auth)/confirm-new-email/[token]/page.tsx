import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getCsrfToken } from '@/lib/csrf';
import { getServerCurrentUser } from '@/utils/auth';

const ConfirmNewEmailCard = dynamic(() => import('../_components/ConfirmNewEmailCard'));

type ConfirmNewEmailPageProps = {
	params: {
		token?: string;
	};
};

const ConfirmNewEmailPage = async ({ params }: ConfirmNewEmailPageProps) => {

	const { token } = params;

	if (!token) {
		redirect('/');
	}

	const csrfToken = await getCsrfToken(headers());

	const currentUser = await getServerCurrentUser();
	
	if (!currentUser?.new_email) {
		redirect('/');
	}

	return (
		<div className="min-h-screen flex justify-center items-center">
			<ConfirmNewEmailCard
				csrfToken={ csrfToken }
				verificationToken={ token }
			/>
		</div>
	);
};

export default ConfirmNewEmailPage;