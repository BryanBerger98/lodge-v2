import { Loader2 } from 'lucide-react';

const UsersLoading = () => {

	return (
		<div className="flex items-center w-full">
			<Loader2
				className="animate-spin"
				size="32"
			/>
		</div>
	);
};

export default UsersLoading;
