import { Loader2 } from 'lucide-react';

const AppLoading = () => {

	return (
		<div className="flex items-center h-full w-full">
			<Loader2
				className="animate-spin"
				size="32"
			/>
		</div>
	);
};

export default AppLoading;
