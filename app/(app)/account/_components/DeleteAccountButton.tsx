'use client';

import { Loader2, Trash } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import PasswordModal, { PasswordModalOpenChangeEvent } from '@/components/features/auth/PasswordModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteUserAccount } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type DeleteAccountButtonProps = {
	csrfToken: string;
	className?: string;
};

const DeleteAccountButton = ({ className, csrfToken }: DeleteAccountButtonProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);

	const { toast } = useToast();

	const handleDeleteAccount = () => setIsPasswordModalOpen(true);

	const handlePasswordModalOpenChange: PasswordModalOpenChangeEvent = async ({ openState, password }) => {

		if (!password) {
			setIsPasswordModalOpen(false);
			return;
		}
		
		try {
			setIsPasswordModalOpen(openState);
			setIsLoading(true);
			await deleteUserAccount(password, { csrfToken });
			await signOut({ redirect: false });
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			toast({
				title: 'Error',
				description: getErrorMessage(apiError),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button
				className={ `gap-2 ${ className }` }
				disabled={ isLoading }
				type="button"
				variant="destructive"
				onClick={ handleDeleteAccount }
			>
				{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash /> }
				Delete account
			</Button>
			<PasswordModal
				description="This action is irreversible. Please enter your password to confirm the deletion of your account."
				isOpen={ isPasswordModalOpen }
				title={ <span className="text-red-500">Delete your account</span> }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default DeleteAccountButton;