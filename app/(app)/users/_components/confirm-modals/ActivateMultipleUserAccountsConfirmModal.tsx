'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { Role } from '@/schemas/role.schema';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { updateMultipleUsers } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';


type ActivateMultipleUserAccountsConfirmModalProps = {
	users: IUserPopulated[];
	onChange: ({ openState, users }: { openState: boolean, users: IUserPopulated[] }) => void;
	isOpen: boolean;
};

const ActivateMultipleUserAccountsConfirmModal = ({ users, isOpen, onChange }: ActivateMultipleUserAccountsConfirmModalProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const handleConfirm = async ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => {
		if (!isConfirmed) return onChange({
			openState,
			users: [], 
		});
		if (!csrfToken) return;
		try {
			setIsLoading(true);
			const usersToUpdate = users.filter(user => user.role !== Role.OWNER).map(user => ({
				id: user.id,
				is_disabled: true,
			}));
			await updateMultipleUsers(usersToUpdate, { csrfToken });
			if (onChange) onChange({
				openState,
				users: users.map(user => ({
					...user,
					is_disabled: false,
				})),
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ConfirmModal
			description={ <span>Are you sure you want to activate these user accounts? These users will be able to log in.</span> }
			isLoading={ isLoading }
			open={ isOpen }
			title="Activate multiple user accounts"
			onOpenChange={ handleConfirm }
		/>
	);
};

export default ActivateMultipleUserAccountsConfirmModal;