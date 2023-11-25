import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils/ui.util';


const ButtonList = ({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
	
	return (
		<div
			className={ cn('flex flex-col gap-0', className) }
			{ ...props }
		>
			{ children }
		</div>
	);
};

export default ButtonList;