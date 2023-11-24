import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type AskForEmailUpdateConfirmationModalProps = {
	isOpen: boolean;
	onOpenChange: (openState: boolean) => void;
}

const AskForEmailUpdateConfirmationModal = ({ isOpen, onOpenChange: handleOpenChange }: AskForEmailUpdateConfirmationModalProps) => {

	const handleClose = () => handleOpenChange(false);

	return (
		<Dialog
			open={ isOpen }
			onOpenChange={ handleOpenChange }
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm email update</DialogTitle>
					<DialogDescription>Please, click on the link received in your new email address inbox to confirm the update.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={ handleClose }
					>Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AskForEmailUpdateConfirmationModal;