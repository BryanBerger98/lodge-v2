'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { updateUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';


type SuspendUserAccountConfirmModalProps = {
	user: IUserPopulated;
	onChange: ({ openState, user }: { openState: boolean, user: IUserPopulated | null }) => void;
	isOpen: boolean;
};

const SuspendUserAccountConfirmModal = ({ user, isOpen, onChange }: SuspendUserAccountConfirmModalProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast({ logError: true });

	const handleConfirm = async ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => {
		if (!isConfirmed) return onChange({
			openState,
			user: null, 
		});
		if (!csrfToken) return;
		try {
			setIsLoading(true);
			await updateUser({
				id: user.id,
				is_disabled: true,
			}, { csrfToken });
			if (onChange) onChange({
				openState,
				user: {
					...user,
					is_disabled: true,
				},
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ConfirmModal
			description={ <span>Are you sure you want to suspend the account of the user named <span className="font-bold text-slate-700 select-none">{ user.first_name && user.last_name ? user.first_name && user.last_name : user.username ? user.username : <span className="italic text-slate-500">No username</span> }</span>? The user will no longer be able to log in.</span> }
			isLoading={ isLoading }
			open={ isOpen }
			title="Suspend a user account"
			variant="destructive"
			onOpenChange={ handleConfirm }
		/>
	);
};

export default SuspendUserAccountConfirmModal;