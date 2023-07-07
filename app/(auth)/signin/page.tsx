import dynamic from 'next/dynamic';

const DynamicSignInForm = dynamic(() => import('./_components/SignInForm'));

const SignInPage = () => {

	return (
		<div className="min-h-screen flex justify-center items-center">
			<DynamicSignInForm />
		</div>
	);
};

export default SignInPage;