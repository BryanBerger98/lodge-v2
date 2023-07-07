import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

import EmailForm from './_components/EmailForm';

const ForgotPasswordPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="min-h-screen flex justify-center items-center">
			<EmailForm csrfToken={ csrfToken } />
		</div>
	);
};

export default ForgotPasswordPage;