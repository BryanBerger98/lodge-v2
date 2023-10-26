'use client';

import { Row } from '@tanstack/react-table';
import { Lock, MoreHorizontal, Trash, Unlock } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationFormModal, { ConfirmationModalOpenChangeEvent } from '@/components/ui/Modal/ConfirmationFormModal';
import ConfirmationModal from '@/components/ui/Modal/ConfirmationModal';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import { deleteMultipleUsers, updateMultipleUsers } from '@/services/users.service';
import { ApiError, getErrorMessage } from '@/utils/error';

import useUsers from '../../_context/users/useUsers';

import { UserColumn } from './columns';

type MenuProps = {
	rowsData: Row<UserColumn>[];
}

type ModalState<T extends ('form' | 'simple')> = T extends 'form' ? {
	isOpen: boolean;
	modalType: T;
	action: 'delete' | 'suspend';
	inputLabel?: string;
	inputType?: 'text' | 'email' | 'password';
	inputPlaceholder?: string;
	valueToValidate: string;
} : {
	isOpen: boolean;
	modalType: T;
	action: 'activate';
};

const getModalContent = () => ({
	delete: {
		title: 'Delete users',
		description: <span>Please enter &quot;<span className="font-bold text-slate-700 select-none">delete users</span>&quot; to confirm the deletion. This action is irreversible.</span>,
	},
	suspend: {
		title: 'Suspend users',
		description: <span>Please enter &quot;<span className="font-bold text-slate-700 select-none">suspend users</span>&quot; to confirm the accounts suspension. The users will no longer be able to log in.</span>,
	},
	activate: {
		title: 'Activate user',
		description: <span>Please confirm the activation of these accounts. The users will be able to log in again.</span>,
	},
	'reset-password': {
		title: 'Send reset password email',
		description: <span>The users will receive a reset password link by email.</span>,
	},
	'verify-email': {
		title: 'Send verification email',
		description: <span>The users will receive a verification link by email.</span>,
	},
});

const Menu = ({ rowsData = [] }: MenuProps) => {

	const { csrfToken } = useCsrf();
	const { updateUsers, refetchUsers } = useUsers();

	const [ confirmationModalState, setConfirmationModalState ] = useState<ModalState<'form' | 'simple'>>({
		isOpen: false,
		modalType: 'form',
		action: 'delete', 
		valueToValidate: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'delete users',
		inputPlaceholder: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'delete users',
	});
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { currentUser } = useAuth();
	const { toast } = useToast();

	const handleDeleteUser = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'form',
			action: 'delete', 
			valueToValidate: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'delete users',
			inputPlaceholder: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'delete users',
		});
	};

	const handleSuspendUser = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'form',
			action: 'suspend',
			valueToValidate: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'suspend users',
			inputPlaceholder: rowsData.length === 1 ? rowsData[ 0 ].original.email : 'suspend users',
		});
	};

	const handleActivateUser = () => {
		setConfirmationModalState({
			isOpen: true,
			modalType: 'simple',
			action: 'activate', 
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
				await deleteMultipleUsers(rowsData.filter(row => row.original.role !== 'owner').map(row => row.original.id), { csrfToken });
				refetchUsers();
			}
			if (confirmationModalState.action === 'suspend') {
				await updateMultipleUsers(rowsData.filter(row => row.original.role !== 'owner').map(row => ({
					id: row.original.id,
					is_disabled: true, 
				})), { csrfToken });
				updateUsers(...rowsData.filter(row => row.original.role !== 'owner').map(row => ({
					id: row.original.id,
					is_disabled: true, 
				})));
			}
			if (confirmationModalState.action === 'activate') {
				await updateMultipleUsers(rowsData.filter(row => row.original.role !== 'owner').map(row => ({
					id: row.original.id,
					is_disabled: false, 
				})), { csrfToken });
				updateUsers(...rowsData.filter(row => row.original.role !== 'owner').map(row => ({
					id: row.original.id,
					is_disabled: false, 
				})));
			}
			setConfirmationModalState({
				...confirmationModalState,
				isOpen: openState,
			});
			const currentUserInSelectedData = rowsData.find(row => row.original.id.toString() === currentUser?.id.toString());
			if (currentUserInSelectedData && currentUser?.role !== 'owner' && [ 'delete', 'suspend' ].includes(confirmationModalState.action)) {
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
						className="gap-2"
						disabled={ rowsData.length === 0 }
						variant="outline"
					>
						<MoreHorizontal size="16" />
						<span className="hidden lg:flex">Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						onClick={ handleActivateUser }
					><Unlock size="16" /> Activate
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleSuspendUser }
					><Lock size="16" /> Suspend
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleDeleteUser }
					><Trash size="16" /> Delete
					</DropdownMenuItem>
				
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationFormModal
				description={ getModalContent()[ confirmationModalState.action ].description }
				inputLabel={ confirmationModalState.modalType === 'form' ? confirmationModalState.inputLabel : '' }
				inputType={ confirmationModalState.modalType === 'form' ? confirmationModalState.inputType : 'text' }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'form' && confirmationModalState.isOpen }
				title={ getModalContent()[ confirmationModalState.action ].title }
				valueToValidate={ confirmationModalState.modalType === 'form' ? confirmationModalState.valueToValidate : '' }
				variant="destructive"
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
			<ConfirmationModal
				description={ getModalContent()[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.modalType === 'simple' && confirmationModalState.isOpen }
				title={ getModalContent()[ confirmationModalState.action ].title }
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
		</>
	);
};

export default Menu;