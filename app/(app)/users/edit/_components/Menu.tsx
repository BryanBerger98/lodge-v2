'use client';

import { ArrowRightLeft, BadgeCheck, KeyRound, MoreHorizontal, Trash } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationFormModal, { ConfirmationModalOpenChangeEvent } from '@/components/ui/Modal/ConfirmationFormModal';
import ConfirmationModal from '@/components/ui/Modal/ConfirmationModal';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import useUsers from '@/context/users/useUsers';
import { deleteUser, sendResetPasswordTokenToUser, sendVerificationTokenToUser } from '@/services/users.service';
import { IUser } from '@/types/user.type';
import { ApiError, getErrorMessage } from '@/utils/error';

type MenuProps = {
	userData: IUser;
	csrfToken: string;
}

type ModalState = {
	isOpen: boolean;
	modalType: 'form' | 'simple';
	action: 'delete' | 'reset-password' | 'verify-email';
}

const getModalContent = (userData: IUser) => ({
	delete: {
		title: 'Delete user',
		description: <span>Please enter the email of the user <span className="font-bold text-slate-700 select-none">{ userData.email }</span> to confirm the deletion. This action is irreversible.</span>,
	},
	'reset-password': {
		title: 'Send reset password email',
		description: <span>The user will receive a reset password link by email.</span>,
	},
	'verify-email': {
		title: 'Send verification email',
		description: <span>The user will receive a verification link by email.</span>,
	},
});

const Menu = ({ userData, csrfToken }: MenuProps) => {

	const { refetchUsers } = useUsers();

	const [ confirmationModalState, setConfirmationModalState ] = useState<ModalState>({
		isOpen: false,
		modalType: 'form',
		action: 'delete', 
	});
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { currentUser } = useAuth();
	const { toast } = useToast();

	const handleDeleteUser = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'form',
			action: 'delete', 
		});
	};

	const handleSendResetPasswordEmail = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'simple',
			action: 'reset-password', 
		});
	};

	const handleSendVerificationEmail = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'simple',
			action: 'verify-email', 
		});
	};

	const handleConfirmationModalOpenChange: ConfirmationModalOpenChangeEvent = async ({ openState, isConfirmed }) => {
		if (!isConfirmed) {
			return setConfirmationModalState({
				...confirmationModalState,
				isOpen: openState, 
			});
		}

		if (!csrfToken) {
			return;
		}

		try {
			setIsLoading(true);
			if (confirmationModalState.action === 'delete') {
				await deleteUser(userData.id, csrfToken);
				refetchUsers();
			}
			if (confirmationModalState.action === 'reset-password') {
				await sendResetPasswordTokenToUser(userData.id, csrfToken);
			}
			if (confirmationModalState.action === 'verify-email') {
				await sendVerificationTokenToUser(userData.id, csrfToken);
			}
			setConfirmationModalState({
				...confirmationModalState,
				isOpen: openState,
			});
			if (currentUser && userData.id.toString() === currentUser.id.toString() && [ 'delete', 'suspend' ].includes(confirmationModalState.action)) {
				await signOut({ redirect: false });
				return;
			}
		} catch (error) {
			console.error(error);
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="gap-2 items-center"
						variant="ghost"
					>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal size="16" />
						Actions
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						onClick={ handleSendResetPasswordEmail }
					><KeyRound size="16" /> Send reset password
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						onClick={ handleSendVerificationEmail }
					><BadgeCheck size="16" /> Send email verification
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						disabled
					><ArrowRightLeft size="16" /> Impersonate
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleDeleteUser }
					><Trash size="16" /> Delete
					</DropdownMenuItem>
				
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationFormModal
				data={ userData }
				description={ getModalContent(userData)[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'form' && confirmationModalState.isOpen }
				keyToValidate="email"
				title={ getModalContent(userData)[ confirmationModalState.action ].title }
				variant="destructive"
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
			<ConfirmationModal
				description={ getModalContent(userData)[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'simple' && confirmationModalState.isOpen }
				title={ getModalContent(userData)[ confirmationModalState.action ].title }
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
		</>
	);
};

export default Menu;