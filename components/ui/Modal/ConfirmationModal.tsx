/* eslint-disable react/jsx-handler-names */
import { Check, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type ConfirmationModalOpenChangeEvent = ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => void;

type ConfirmationFormModalProps = {
	isOpen: boolean;
	onOpenChange: ConfirmationModalOpenChangeEvent;
	title?: ReactNode;
	description?: ReactNode;
	variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link';
	isLoading?: boolean;
	children?: ReactNode;
}

const ConfirmationModal = ({ isOpen, onOpenChange, title, description, variant = 'default', children= null, isLoading = false }: ConfirmationFormModalProps) => {

	
	const handeConfirm = () => {
		onOpenChange({
			openState: false,
			isConfirmed: true, 
		});
	};

	const handleOpenChange = (openState: boolean) => {
		onOpenChange({
			openState,
			isConfirmed: false, 
		});
	};

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ !isLoading ? handleOpenChange : undefined }
		>
			<DialogContent
				className="sm:max-w-[425px]"
			>
				<DialogHeader className="mb-4">
					<DialogTitle className={ variant === 'destructive' ? 'text-red-500' : '' }>{ title || 'This action needs to be confirmed.' }</DialogTitle>
					<DialogDescription>
						{ description || 'Are you sure you want to perform this action?' }
					</DialogDescription>
				</DialogHeader>
				{
					children ?
						<DialogContent>
							{ children }
						</DialogContent>
						: null
				}
				<DialogFooter className="mt-4">
					<Button
						className="gap-2"
						disabled={ isLoading }
						variant={ variant }
						onClick={ handeConfirm }
					>
						{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check /> }
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationModal;