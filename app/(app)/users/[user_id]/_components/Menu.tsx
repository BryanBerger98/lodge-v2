'use client';

import { ArrowRightLeft, BadgeCheck, KeyRound, MoreHorizontal, Trash } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationFormModal, { ConfirmationModalOpenChangeEvent } from '@/components/ui/Modal/ConfirmationFormModal';
import ConfirmationModal from '@/components/ui/Modal/ConfirmationModal';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useUser from '@/context/users/user/useUser';
import { Role } from '@/schemas/role.schema';
import { UserPopulated } from '@/schemas/user/populated.schema';
import { deleteUser, sendResetPasswordTokenToUser, sendVerificationTokenToUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';

type ModalState<T extends ('form' | 'simple')> = T extends 'form' ? {
	isOpen: boolean;
	modalType: T;
	action: 'delete';
	inputLabel?: string;
	inputType?: 'text' | 'email' | 'password';
	valueToValidate: string;
} : {
	isOpen: boolean;
	modalType: T;
	action: 'reset-password' | 'verify-email';
};

const getModalContent = (user?: UserPopulated | null) => ({
	delete: {
		title: 'Delete user',
		description: <span>Please enter the email of the user <span className="font-bold text-slate-700 select-none">{ user?.email }</span> to confirm the deletion. This action is irreversible.</span>,
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

const Menu = () => {

	const { csrfToken } = useCsrf();
	const { user } = useUser();
	const router = useRouter();

	const [ confirmationModalState, setConfirmationModalState ] = useState<ModalState<'form' | 'simple'>>({
		isOpen: false,
		modalType: 'form',
		action: 'delete',
		valueToValidate: user?.email || '',
		inputLabel: 'Email',
		inputType: 'email',
	});
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { currentUser } = useAuth();
	const { toast } = useToast();

	const handleDeleteUser = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'form',
			action: 'delete', 
			valueToValidate: user?.email || '',
			inputLabel: 'Email',
			inputType: 'email',
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

		if (!csrfToken || !user) {
			return;
		}

		try {
			setIsLoading(true);
			if (confirmationModalState.action === 'delete') {
				await deleteUser(user.id, { csrfToken });
				router.push('/users');
			}
			if (confirmationModalState.action === 'reset-password') {
				await sendResetPasswordTokenToUser(user.id, { csrfToken });
			}
			if (confirmationModalState.action === 'verify-email') {
				await sendVerificationTokenToUser(user.id, { csrfToken });
			}
			setConfirmationModalState({
				...confirmationModalState,
				isOpen: openState,
			});
			if (currentUser && user.id.toString() === currentUser.id.toString() && [ 'delete', 'suspend' ].includes(confirmationModalState.action)) {
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
			<DropdownMenu modal={ false }>
				<DropdownMenuTrigger asChild>
					<Button
						className="gap-2 items-center"
						variant="ghost"
					>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal size="16" />
						<span className="hidden md:inline">Actions</span>
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
					{
						user?.role !== Role.OWNER ?
							<>
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
							</>
							: null
					}
				
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationFormModal
				description={ getModalContent(user)[ confirmationModalState.action ].description }
				inputLabel={ confirmationModalState.modalType === 'form' ? confirmationModalState.inputLabel : '' }
				inputType={ confirmationModalState.modalType === 'form' ? confirmationModalState.inputType : 'text' }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'form' && confirmationModalState.isOpen }
				title={ getModalContent(user)[ confirmationModalState.action ].title }
				valueToValidate={ confirmationModalState.modalType === 'form' ? confirmationModalState.valueToValidate : '' }
				variant="destructive"
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
			<ConfirmationModal
				description={ getModalContent(user)[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'simple' && confirmationModalState.isOpen }
				title={ getModalContent(user)[ confirmationModalState.action ].title }
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
		</>
	);
};

export default Menu;