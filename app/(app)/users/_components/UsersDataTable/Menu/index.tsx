'use client';

import { ArrowRightLeft, BadgeCheck, Edit, KeyRound, Lock, MoreHorizontal, Trash, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationFormModal, { ConfirmationModalOpenChangeEvent } from '@/components/ui/Modal/ConfirmationFormModal';
import ConfirmationModal from '@/components/ui/Modal/ConfirmationModal';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useUsers from '@/context/users/useUsers';
import { deleteUser, updateUser as updateUserQuery } from '@/services/users.service';
import { ApiError, getErrorMessage } from '@/utils/error';

import { UserColumn } from '../columns';

type MenuProps = {
	rowData: UserColumn;
}

type ModalState = {
	isOpen: boolean;
	action: 'delete' | 'suspend' | 'activate';
}

const getModalContent = (rowData: UserColumn) => ({
	delete: {
		title: 'Delete user',
		description: <span>Please enter the email of the user <span className="font-bold text-slate-700 select-none">{ rowData.email }</span> to confirm the deletion. This action is irreversible.</span>,
	},
	suspend: {
		title: 'Suspend user',
		description: <span>Please enter the email of the user <span className="font-bold text-slate-700 select-none">{ rowData.email }</span> to confirm the account suspension. The user will no longer be able to log in.</span>,
	},
	activate: {
		title: 'Activate user',
		description: <span>Please confirm the account activation. The user will be able to log in again.</span>,
	},
});

const Menu = ({ rowData }: MenuProps) => {

	const { csrfToken } = useCsrf();
	const { updateUser } = useUsers();

	const [ confirmationModalState, setConfirmationModalState ] = useState<ModalState>({
		isOpen: false,
		action: 'delete', 
	});
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();
	const { data: session } = useSession();
	const { toast } = useToast();

	const handleDeleteUser = () => {
		setConfirmationModalState({
			isOpen: true,
			action: 'delete', 
		});
	};

	const handleSuspendUser = () => {
		setConfirmationModalState({
			isOpen: true,
			action: 'suspend', 
		});
	};

	const handleActivateUser = () => {
		setConfirmationModalState({
			isOpen: true,
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
				await deleteUser(rowData.id, csrfToken);
				// TODO => Refetch users on delete
			}
			if (confirmationModalState.action === 'suspend') {
				await updateUserQuery({
					id: rowData.id,
					is_disabled: true,
				}, csrfToken);
				updateUser({
					...rowData,
					is_disabled: true, 
				});
			}
			if (confirmationModalState.action === 'activate') {
				await updateUserQuery({
					id: rowData.id,
					is_disabled: false,
				}, csrfToken);
				updateUser({
					...rowData,
					is_disabled: false, 
				});
			}
			setConfirmationModalState({
				...confirmationModalState,
				isOpen: openState,
			});
			if (session && rowData.id.toString() === session.user.id.toString() && [ 'delete', 'suspend' ].includes(confirmationModalState.action)) {
				await signOut({ redirect: false });
				return router.replace('/signin');
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
						className="h-8 w-8 p-0"
						variant="ghost"
					>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						asChild
					>
						<Link href={ `/users/edit/${ rowData.id }` }>
							<Edit size="16" />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						disabled
					><KeyRound size="16" /> Send reset password
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						disabled
					><BadgeCheck size="16" /> Send email verification
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						disabled
					><ArrowRightLeft size="16" /> Impersonate
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{
						rowData.is_disabled ?
							<DropdownMenuItem
								className="gap-2 hover:cursor-pointer"
								onClick={ handleActivateUser }
							><Unlock size="16" /> Activate
							</DropdownMenuItem>
							:
							<DropdownMenuItem
								className="gap-2 text-red-500 hover:cursor-pointer"
								onClick={ handleSuspendUser }
							><Lock size="16" /> Suspend
							</DropdownMenuItem>
					}
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleDeleteUser }
					><Trash size="16" /> Delete
					</DropdownMenuItem>
				
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationFormModal
				data={ rowData }
				description={ getModalContent(rowData)[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.action !== 'activate' && confirmationModalState.isOpen }
				keyToValidate="email"
				title={ getModalContent(rowData)[ confirmationModalState.action ].title }
				variant="destructive"
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
			<ConfirmationModal
				description={ getModalContent(rowData)[ confirmationModalState.action ].description }
				isLoading={ isLoading }
				isOpen={ confirmationModalState.action === 'activate' && confirmationModalState.isOpen }
				title={ getModalContent(rowData)[ confirmationModalState.action ].title }
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
		</>
	);
};

export default Menu;