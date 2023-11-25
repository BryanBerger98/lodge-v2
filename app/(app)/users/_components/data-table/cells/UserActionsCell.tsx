import { BadgeCheck, Edit, KeyRound, Lock, MoreHorizontal, Trash, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useUsers from '@/context/users/useUsers';
import { UserPopulated } from '@/schemas/user/populated.schema';

import ActivateUserAccountConfirmModal from '../../confirm-modals/ActivateUserAccountConfirmModal';
import DeleteUserAccountConfirmModal from '../../confirm-modals/DeleteUserAccountConfirmModal';
import SendUserEmailVerificationConfirmModal from '../../confirm-modals/SendUserEmailVerificationConfirmModal';
import SendUserResetPasswordConfirmModal from '../../confirm-modals/SendUserResetPasswordConfirmModal';
import SuspendUserAccountConfirmModal from '../../confirm-modals/SuspendUserAccountConfirmModal';

type UserActionsCellProps = {
	rowData: UserPopulated;
};

const UserActionsCell = ({ rowData }: UserActionsCellProps) => {

	const { updateUsers, refetchUsers } = useUsers();
	const [ confirmModalOpenState, setConfirmModalOpenState ] = useState<'suspend' | 'activate' | 'reset-password' | 'verify-email' | 'delete' | null>(null);

	const handleTriggerAction = (action: 'activate' | 'suspend' | 'reset-password' | 'verify-email' | 'delete') => () => setConfirmModalOpenState(action);

	const handleConfirm = ({ user }: { openState: boolean, user: UserPopulated | null }) => {
		if (!user) {
			return setConfirmModalOpenState(null);
		}
		if (confirmModalOpenState === 'delete') {
			refetchUsers();
		} else {
			updateUsers(user);
		}
		setConfirmModalOpenState(null);
	};

	return (
		<>
			<DropdownMenu
				modal={ false }
			>
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
						<Link
							href={ `/users/${ rowData.id }` }
						>
							<Edit size="16" />
							Edit
						</Link>
					</DropdownMenuItem>
					{
						!rowData.is_disabled ? (
							<>
								<DropdownMenuItem
									className="gap-2 hover:cursor-pointer"
									onClick={ handleTriggerAction('reset-password') }
								><KeyRound size="16" /> Send reset password link
								</DropdownMenuItem>
								{
									!rowData.has_email_verified ?
										<DropdownMenuItem
											className="gap-2 hover:cursor-pointer"
											onClick={ handleTriggerAction('verify-email') }
										><BadgeCheck size="16" /> Send email verification link
										</DropdownMenuItem>
										: null
								}
							</>
						) : null
					}
					<DropdownMenuSeparator />
					{
						rowData.is_disabled ?
							<DropdownMenuItem
								className="gap-2 hover:cursor-pointer"
								onClick={ handleTriggerAction('activate') }
							><Unlock size="16" /> Activate account
							</DropdownMenuItem>
							:
							<DropdownMenuItem
								className="gap-2 text-red-500 hover:cursor-pointer"
								onClick={ handleTriggerAction('suspend') }
							><Lock size="16" /> Suspend account
							</DropdownMenuItem>
					}
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleTriggerAction('delete') }
					><Trash size="16" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ActivateUserAccountConfirmModal
				isOpen={ confirmModalOpenState === 'activate' }
				user={ rowData }
				onChange={ handleConfirm }
			/>
			<SuspendUserAccountConfirmModal
				isOpen={ confirmModalOpenState === 'suspend' }
				user={ rowData }
				onChange={ handleConfirm }
			/>
			<SendUserResetPasswordConfirmModal
				isOpen={ confirmModalOpenState === 'reset-password' }
				user={ rowData }
				onChange={ handleConfirm }
			/>
			<SendUserEmailVerificationConfirmModal
				isOpen={ confirmModalOpenState === 'verify-email' }
				user={ rowData }
				onChange={ handleConfirm }
			/>
			<DeleteUserAccountConfirmModal
				isOpen={ confirmModalOpenState === 'delete' }
				user={ rowData }
				onChange={ handleConfirm }
			/>
		</>
	);
};

export default UserActionsCell;