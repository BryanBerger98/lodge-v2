'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { deleteUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';


type DeleteUserAccountConfirmModalProps = {
	user: IUserPopulated;
	onChange: ({ openState, user }: { openState: boolean, user: IUserPopulated | null }) => void;
	isOpen: boolean;
};

const DeleteUserAccountConfirmModal = ({ user, isOpen, onChange }: DeleteUserAccountConfirmModalProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const handleConfirm = async ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => {
		if (!isConfirmed) return onChange({
			openState,
			user: null, 
		});
		if (!csrfToken) return;
		try {
			setIsLoading(true);
			await deleteUser(user.id, { csrfToken });
			if (onChange) onChange({
				openState,
				user,
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ConfirmModal
			description={ <span>Are you sure you want to delete the account of the user named <span className="font-bold text-slate-700 select-none">{ user.first_name && user.last_name ? user.first_name && user.last_name : user.username ? user.username : <span className="italic text-slate-500">No username</span> }</span>? This action is irreversible.</span> }
			isLoading={ isLoading }
			open={ isOpen }
			title="Delete a user account"
			variant="destructive"
			onOpenChange={ handleConfirm }
		/>
	);
};

export default DeleteUserAccountConfirmModal;