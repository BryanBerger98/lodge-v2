import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import authOptions from '@/lib/auth';
import { getCsrfToken } from '@/lib/csrf';

const SendEmailConfirmationCard = dynamic(() => import('./_components/SendEmailConfirmationCard'));

const ConfirmEmailPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	const session = await getServerSession(authOptions);
	
	if (session?.user.has_email_verified) {
		redirect('/');
	}

	return (
		<div className="min-h-screen flex justify-center items-center">
			<SendEmailConfirmationCard csrfToken={ csrfToken } />
		</div>
	);
};

export default ConfirmEmailPage;