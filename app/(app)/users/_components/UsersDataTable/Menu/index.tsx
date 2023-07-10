'use client';

import { ArrowRightLeft, BadgeCheck, CircleOff, Edit, KeyRound, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationFormModal, { ConfirmationModalOpenChangeEvent } from '@/components/ui/Modal/ConfirmationFormModal';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import { deleteUser } from '@/services/users.service';
import { ApiError, getErrorMessage } from '@/utils/error';

import { UserColumn } from '../columns';

type MenuProps = {
	rowData: UserColumn;
}

const Menu = ({ rowData }: MenuProps) => {

	const { csrfToken } = useCsrf();

	const [ isConfirmationModalOpen, setIsConfirmationModalOpen ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();
	const { data: session } = useSession();
	const { toast } = useToast();

	const handleDeleteUser = () => {
		setIsConfirmationModalOpen(true);
	};

	const handleConfirmationModalOpenChange: ConfirmationModalOpenChangeEvent = async ({ openState, isConfirmed }) => {
		if (!isConfirmed) {
			return setIsConfirmationModalOpen(openState);
		}

		if (!csrfToken) {
			return;
		}

		try {
			setIsLoading(true);
			await deleteUser(rowData.id, csrfToken);
			setIsConfirmationModalOpen(openState);
			if (session && rowData.id.toString() === session.user.id.toString()) {
				await signOut({ redirect: false });
				return router.replace('/signin');
			}
			router.refresh();
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
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						disabled
					><CircleOff size="16" /> Suspend
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-red-500 hover:cursor-pointer"
						onClick={ handleDeleteUser }
					><Trash size="16" /> Delete
					</DropdownMenuItem>
				
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmationFormModal
				data={ rowData }
				description={ <span>Please enter the email of the user <span className="font-bold text-slate-700 select-none">{ rowData.email }</span> to confirm the deletion. This action is irreversible.</span> }
				isLoading={ isLoading }
				isOpen={ isConfirmationModalOpen }
				keyToValidate="email"
				title="Delete user"
				variant="destructive"
				onOpenChange={ handleConfirmationModalOpenChange }
			/>
		</>
	);
};

export default Menu;