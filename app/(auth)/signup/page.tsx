import dynamic from 'next/dynamic';
import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';


const DynamicSignUpForm = dynamic(() => import('./_components/SignUpForm'));

const SignUpPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignUpForm csrfToken={ csrfToken } />
		</div>
	);
};

export default SignUpPage;