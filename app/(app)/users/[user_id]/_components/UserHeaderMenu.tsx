import { BadgeCheck, KeyRound, Lock, MoreHorizontal, Trash, Unlock } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useUser from '@/context/users/user/useUser';
import { IUserPopulated } from '@/schemas/user/populated.schema';

import ActivateUserAccountConfirmModal from '../../_components/confirm-modals/ActivateUserAccountConfirmModal';
import DeleteUserAccountConfirmModal from '../../_components/confirm-modals/DeleteUserAccountConfirmModal';
import SendUserEmailVerificationConfirmModal from '../../_components/confirm-modals/SendUserEmailVerificationConfirmModal';
import SendUserResetPasswordConfirmModal from '../../_components/confirm-modals/SendUserResetPasswordConfirmModal';
import SuspendUserAccountConfirmModal from '../../_components/confirm-modals/SuspendUserAccountConfirmModal';

const UserHeaderMenu = () => {

	const [ confirmModalOpenState, setConfirmModalOpenState ] = useState<'suspend' | 'activate' | 'reset-password' | 'verify-email' | 'delete' | null>(null);

	const { user, setUser } = useUser();
	const router = useRouter();

	if (!user) return null;


	const handleTriggerAction = (action: 'activate' | 'suspend' | 'reset-password' | 'verify-email' | 'delete') => () => setConfirmModalOpenState(action);

	const handleConfirm = ({ user: updatedUser }: { openState: boolean, user: IUserPopulated | null }) => {
		if (!updatedUser) {
			return setConfirmModalOpenState(null);
		}
		if (confirmModalOpenState === 'delete') {
			router.push('/users');
		}
		setUser(updatedUser);
		setConfirmModalOpenState(null);
	};

	return (
		<>
			<DropdownMenu
				modal={ false }
			>
				<DropdownMenuTrigger asChild>
					<Button
						className="gap-2 items-center"
						variant="ghost"
					>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="w-4 h-4" />
						<span className="hidden md:inline">Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{
						!user.is_disabled ? (
							<>
								<DropdownMenuItem
									className="gap-2 hover:cursor-pointer"
									onClick={ handleTriggerAction('reset-password') }
								><KeyRound size="16" /> Send reset password link
								</DropdownMenuItem>
								{
									!user.has_email_verified ?
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
						user.is_disabled ?
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
				user={ user }
				onChange={ handleConfirm }
			/>
			<SuspendUserAccountConfirmModal
				isOpen={ confirmModalOpenState === 'suspend' }
				user={ user }
				onChange={ handleConfirm }
			/>
			<SendUserResetPasswordConfirmModal
				isOpen={ confirmModalOpenState === 'reset-password' }
				user={ user }
				onChange={ handleConfirm }
			/>
			<SendUserEmailVerificationConfirmModal
				isOpen={ confirmModalOpenState === 'verify-email' }
				user={ user }
				onChange={ handleConfirm }
			/>
			<DeleteUserAccountConfirmModal
				isOpen={ confirmModalOpenState === 'delete' }
				user={ user }
				onChange={ handleConfirm }
			/>
		</>
	);
};

export default UserHeaderMenu;