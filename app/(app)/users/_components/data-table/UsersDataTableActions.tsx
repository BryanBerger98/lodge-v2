import { Lock, Trash, Unlock } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import useDataTable from '@/components/ui/DataTable/useDataTable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserPopulated } from '@/schemas/user/populated.schema';

import useUsers from '../../_context/users/useUsers';
import ActivateMultipleUserAccountsConfirmModal from '../confirm-modals/ActivateMultipleUserAccountsConfirmModal';
import DeleteMultipleUserAccountsConfirmModal from '../confirm-modals/DeleteMultipleUserAccountsConfirmModal';
import SuspendMultipleUserAccountsConfirmModal from '../confirm-modals/SuspendMultipleUserAccounts';


const UsersDataTableActions = () => {

	const { table } = useDataTable<UserPopulated, unknown>();
	const selectedUsers = table.getSelectedRowModel().rows.map(row => row.original);

	const { updateUsers, refetchUsers } = useUsers();
	const [ confirmModalOpenState, setConfirmModalOpenState ] = useState<'suspend' | 'activate' | 'reset-password' | 'verify-email' | 'delete' | null>(null);

	const handleTriggerAction = (action: 'activate' | 'suspend' | 'reset-password' | 'verify-email' | 'delete') => () => setConfirmModalOpenState(action);

	const handleConfirm = ({ users }: { openState: boolean, users: UserPopulated[] }) => {
		if (!users.length) {
			return setConfirmModalOpenState(null);
		}
		if (confirmModalOpenState === 'delete') {
			refetchUsers();
		} else {
			updateUsers(...users);
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
						disabled={ selectedUsers.length === 0 }
						variant="ghost"
					>
						<span className="sr-only">Open menu</span>
						<span className="hidden lg:flex">Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						asChild
					>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 hover:cursor-pointer"
						onClick={ handleTriggerAction('activate') }
					><Unlock size="16" /> Activate accounts
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleTriggerAction('suspend') }
					><Lock size="16" /> Suspend accounts
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleTriggerAction('delete') }
					><Trash size="16" /> Delete accounts
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ActivateMultipleUserAccountsConfirmModal
				isOpen={ confirmModalOpenState === 'activate' }
				users={ selectedUsers }
				onChange={ handleConfirm }
			/>
			<SuspendMultipleUserAccountsConfirmModal
				isOpen={ confirmModalOpenState === 'suspend' }
				users={ selectedUsers }
				onChange={ handleConfirm }
			/>
			<DeleteMultipleUserAccountsConfirmModal
				isOpen={ confirmModalOpenState === 'delete' }
				users={ selectedUsers }
				onChange={ handleConfirm }
			/>
		</>
	);
};

export default UsersDataTableActions;