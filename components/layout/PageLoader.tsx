import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/ui.util';

const PageLoader = ({ className, iconSize = 56 }: { className?: string, iconSize?: number | string }) => (
	<div className={ cn('flex items-center h-screen justify-center w-full', className) }>
		<Loader2
			className="animate-spin"
			size={ iconSize }
		/>
	</div>
);

export default PageLoader;