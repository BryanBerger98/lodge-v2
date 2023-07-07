import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCsrfToken } from '@/utils/csrf.util';

import ConfirmEmailCard from '../_components/ConfirmEmailCard';


type ConfirmEmailPageProps = {
	params: {
		token: string;
	};
};

const ConfirmEmailPage = async ({ params }: ConfirmEmailPageProps) => {
	const csrfToken = await getCsrfToken(headers());

	const session = await getServerSession(authOptions);

	if (session?.user.has_email_verified) {
		redirect('/');
	}

	return (
		<div className="min-h-screen flex justify-center items-center">
			<ConfirmEmailCard
				csrfToken={ csrfToken }
				verificationToken={ params.token }
			/>
		</div>
	);
};

export default ConfirmEmailPage;