import { type VariantProps, cva } from 'class-variance-authority';
import { BlockquoteHTMLAttributes, HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/utils/ui.util';

export const paragraphVariants = cva(
	'',
	{
		variants: {
			variant: {
				default: 'leading-7 [&:not(:first-child)]:mt-6',
				bold: 'leading-7 [&:not(:first-child)]:mt-6 font-semibold',
				lead: 'text-xl text-muted-foreground',
				large: 'text-lg font-semibold',
				small: 'text-sm font-medium leading-none',
				muted: 'text-sm text-muted-foreground',
			},
		},
		defaultVariants: { variant: 'default' },
	}
);

export const Paragraph = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof paragraphVariants>>(({ className, variant, ...props }, ref) => {
	return (
		<p
			{ ...props }
			className={ cn(paragraphVariants({ variant }), className) }
			ref={ ref }
		/>
	);
});
Paragraph.displayName = 'Paragraph';

export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteHTMLAttributes<HTMLQuoteElement>>(({ className, ...props }, ref) => {
	return (
		<blockquote
			{ ...props }
			className={ cn('mt-6 border-l-2 pl-6 italic', className) }
			ref={ ref }
		/>
	);
});
Blockquote.displayName = 'Blockquote';

export const InlineCode = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => {
	return (
		<code
			{ ...props }
			className={ cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className) }
			ref={ ref }
		/>
	);
});
InlineCode.displayName = 'InlineCode';