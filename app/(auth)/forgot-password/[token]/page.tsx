import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

import ResetPasswordForm from '../_components/ResetPasswordForm';

type ResetPasswordPageProps = {
	params: {
		token: string;
	};
};

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="min-h-screen flex justify-center items-center">
			<ResetPasswordForm
				csrfToken={ csrfToken }
				verificationToken={ params.token }
			/>
		</div>
	);
};

export default ResetPasswordPage;