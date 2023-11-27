'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { deleteMultipleUsers } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

type DeleteMultipleUserAccountsConfirmModalProps = {
	users: IUserPopulated[];
	onChange: ({ openState, users }: { openState: boolean, users: IUserPopulated[] }) => void;
	isOpen: boolean;
};

const DeleteMultipleUserAccountsConfirmModal = ({ users, isOpen, onChange }: DeleteMultipleUserAccountsConfirmModalProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast({ logError: true });

	const handleConfirm = async ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => {
		if (!isConfirmed) return onChange({
			openState,
			users: [], 
		});
		if (!csrfToken) return;
		try {
			setIsLoading(true);
			await deleteMultipleUsers(users.filter(user => user.role !== 'owner').map(user => user.id), { csrfToken });
			if (onChange) onChange({
				openState,
				users,
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ConfirmModal
			description={ <span>Are you sure you want to delete these user accounts? This action is irreversible.</span> }
			isLoading={ isLoading }
			open={ isOpen }
			title="Delete multiple user accounts"
			variant="destructive"
			onOpenChange={ handleConfirm }
		/>
	);
};

export default DeleteMultipleUserAccountsConfirmModal;