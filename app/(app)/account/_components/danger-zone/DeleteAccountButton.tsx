'use client';

import { Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import PasswordModal from '@/app/_components/modals/auth/PasswordModal';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { deleteUserAccount } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';

const DeleteAccountButton = () => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);

	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const handleDeleteAccount = () => setIsPasswordModalOpen(true);

	const handlePasswordModalOpenChange = async ({ openState, password }: { openState: boolean, password: string }) => {
		if (!password && !isLoading) {
			setIsPasswordModalOpen(false);
			return;
		}
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			await deleteUserAccount(password, { csrfToken });
			setIsPasswordModalOpen(openState);
			await signOut({ redirect: false });
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<ButtonItem
				className="text-destructive"
				isLoading={ isLoading }
				rightIcon={ 
					<Trash2
						className="text-destructive"
						size="16"
					/> 
				}
				type="button"
				variant="destructive"
				onClick={ handleDeleteAccount }
			>
				Delete my account
			</ButtonItem>
			<PasswordModal
				description="This action is irreversible. Please enter your password to confirm the deletion of your account."
				isLoading={ isLoading }
				isOpen={ isPasswordModalOpen }
				title="Delete your account"
				variant="destructive"
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default DeleteAccountButton;