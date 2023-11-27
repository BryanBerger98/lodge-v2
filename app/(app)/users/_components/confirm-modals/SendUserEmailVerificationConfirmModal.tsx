'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { sendVerificationTokenToUser } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

type SendUserEmailVerificationConfirmModalProps = {
	user: IUserPopulated;
	onChange: ({ openState, user }: { openState: boolean, user: IUserPopulated | null }) => void;
	isOpen: boolean;
};

const SendUserEmailVerificationConfirmModal = ({ user, isOpen, onChange }: SendUserEmailVerificationConfirmModalProps) => {

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
			await sendVerificationTokenToUser(user.id, { csrfToken });
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
			description={ <span><span className="font-bold text-slate-700 select-none">{ user.first_name && user.last_name ? user.first_name && user.last_name : user.username ? user.username : <span className="italic text-slate-500">No username</span> }</span> will receive a verification link by email.</span> }
			isLoading={ isLoading }
			open={ isOpen }
			title="Email verification"
			onOpenChange={ handleConfirm }
		/>
	);
};

export default SendUserEmailVerificationConfirmModal;