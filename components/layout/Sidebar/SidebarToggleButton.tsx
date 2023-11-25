'use client';

import { Menu } from 'lucide-react';
import { MouseEventHandler, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/ui.util';

import useSidebar from './useSidebar';

const SidebarToggleButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, onClick, children, ...props }, ref) => {

	const { setIsOpen } = useSidebar();

	const handleToggleSidebar: MouseEventHandler<HTMLButtonElement> = (event) => {
		if (onClick) {
			onClick(event);
		}
		setIsOpen(prevState => !prevState);
	};

	return (
		<Button
			className={ cn('absolute left-2 top-2 bottom-2 p-0 h-10 w-10', className) }
			variant={ variant || 'ghost' }
			onClick={ handleToggleSidebar }
			{ ...props }
			ref={ ref }
		>
			{ children || <Menu size="24" /> }
		</Button>
	);
});

export default SidebarToggleButton;