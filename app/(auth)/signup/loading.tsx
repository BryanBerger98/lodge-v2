import { Loader2 } from 'lucide-react';

const SignUpLoading = () => {

	return (
		<div className="flex items-center h-screen justify-center w-full">
			<Loader2
				className="animate-spin"
				size="56"
			/>
		</div>
	);
};

export default SignUpLoading;
