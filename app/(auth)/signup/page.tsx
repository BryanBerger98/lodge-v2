import { headers } from 'next/headers';

import { getCsrfToken } from '@/utils/csrf.util';

import SignUpForm from './_components/SignUpForm';

const SignUpPage = async () => {
	const csrfToken = await getCsrfToken(headers());

	return (
		<div className="min-h-screen flex justify-center items-center">
			<SignUpForm csrfToken={ csrfToken } />
		</div>
	);
};

export default SignUpPage;

// export const getServerSideProps: GetServerSideProps = async ({ res }) => {
// 	const csrfToken = await getCsrfToken(res);
// 	return { props: { csrfToken } };
// };