import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Check, Loader2, X } from 'lucide-react';
import { ReactNode } from 'react';

import { AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle } from '@/components/ui/alert-dialog';

type DialogConfirmProps = {
	title?: ReactNode;
	description?: ReactNode;
	variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link';
	isLoading?: boolean;
	asChild?: boolean;
	onOpenChange?: ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => void;
} & Omit<AlertDialogPrimitive.AlertDialogProps, 'onOpenChange'>;

const DialogConfirm = ({ title, variant, description, children, isLoading, onOpenChange, ...props }: DialogConfirmProps) => {

	const handleConfirm = () => {
		if (onOpenChange) {
			onOpenChange({
				openState: false,
				isConfirmed: true, 
			});
		}
	};

	const handleOpenChange = (openState: boolean) => {
		if (!isLoading && onOpenChange) {
			onOpenChange({
				openState,
				isConfirmed: false, 
			});
		}
	};

	return (
		<AlertDialog
			{ ...props }
			onOpenChange={ handleOpenChange }
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle variant={ variant }>{ title || 'This action needs to be confirmed.' }</AlertDialogTitle>
					<AlertDialogDescription>
						{ description || 'Are you sure you want to perform this action?' }
					</AlertDialogDescription>
				</AlertDialogHeader>
				{ children }
				<AlertDialogFooter>
					<AlertDialogCancel className="gap-2"><X size="16" /> Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="gap-2"
						disabled={ isLoading }
						variant={ variant }
						onClick={ handleConfirm }
					>
						{ 
							isLoading ? 
								<Loader2
									className="animate-spin"
									size="16"
								/> 
								: <Check size="16" />
						}
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DialogConfirm;