import { HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';

export const Heading1 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
	return (
		<h1
			{ ...props }
			className={ cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className) }
			ref={ ref }
		/>
	);
});
Heading1.displayName = 'Heading1';

export const Heading2 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
	return (
		<h2
			{ ...props }
			className={ cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className) }
			ref={ ref }
		/>
	);
});
Heading2.displayName = 'Heading2';

export const Heading3 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
	return (
		<h3
			{ ...props }
			className={ cn('scroll-m-20 text-2xl font-semibold tracking-tight', className) }
			ref={ ref }
		/>
	);
});
Heading3.displayName = 'Heading3';

export const Heading4 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
	return (
		<h4
			{ ...props }
			className={ cn('scroll-m-20 text-xl font-semibold tracking-tight', className) }
			ref={ ref }
		/>
	);
});
Heading4.displayName = 'Heading4';