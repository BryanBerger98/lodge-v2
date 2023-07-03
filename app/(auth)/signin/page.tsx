import { Card } from '@/components/ui/card';

import SignInForm from './_components/SignInForm';

const SignInPage = () => {
	

	return (
		<div className="min-h-screen flex justify-center items-center">
			<Card className="min-w-[420px]">
				<SignInForm />
			</Card>
		</div>
	);
};

export default SignInPage;