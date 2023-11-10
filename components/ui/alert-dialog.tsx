import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/ui.util';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		className={ cn(
			'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		) }
		{ ...props }
		ref={ ref }
	/>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
	<AlertDialogPortal>
		<AlertDialogOverlay />
		<AlertDialogPrimitive.Content
			className={ cn(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
				className
			) }
			ref={ ref }
			{ ...props }
		/>
	</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className,	...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={ cn(
			'flex flex-col space-y-2 text-center sm:text-left',
			className
		) }
		{ ...props }
	/>
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className,	...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={ cn(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className
		) }
		{ ...props }
	/>
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const alertDialogTitleVariants = cva(
	'',
	{
		variants: {
			variant: {
				default: 'text-primary',
				destructive: 'text-destructive',
				outline: 'text-accent',
				secondary: 'text-secondary',
				ghost: 'text-accent',
				link: 'text-primary',
				warning: 'text-warning',
				success: 'tex-success',
				info: 'text-info',
				purple: 'text-purple',
				yellow: 'tex-yellow',
			},
		},
		defaultVariants: { variant: 'default' },
	}
);

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & VariantProps<typeof alertDialogTitleVariants>
>(({ className, variant, ...props }, ref) => (
	<AlertDialogPrimitive.Title
		className={ cn('text-lg font-semibold', alertDialogTitleVariants({ variant }), className) }
		ref={ ref }
		{ ...props }
	/>
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description
		className={ cn('text-sm text-muted-foreground', className) }
		ref={ ref }
		{ ...props }
	/>
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, ...props }, ref) => (
	<AlertDialogPrimitive.Action
		className={ cn(buttonVariants({
			variant,
			size, 
		}), className) }
		ref={ ref }
		{ ...props }
	/>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		className={ cn(
			buttonVariants({ variant: 'outline' }),
			'mt-2 sm:mt-0',
			className
		) }
		ref={ ref }
		{ ...props }
	/>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};