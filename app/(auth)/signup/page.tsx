import { Card } from '@/components/ui/card';

import SignUpForm from './_components/SignUpForm';

const SignUpPage = () => {
	

	return (
		<div className="min-h-screen flex justify-center items-center">
			<Card className="min-w-[420px]">
				<SignUpForm />
			</Card>
		</div>
	);
};

export default SignUpPage;