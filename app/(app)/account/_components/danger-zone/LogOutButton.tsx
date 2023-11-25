'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import DialogConfirm from '@/components/ui/Dialog/DialogConfirm';
import useErrorToast from '@/hooks/error/useErrorToast';
import { ApiError } from '@/utils/api/error';

const LogOutButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogConfirmOpen, setIsDialogConfirmOpen ] = useState(false);

	const { triggerErrorToast } = useErrorToast();

	const handleSignOut = () => setIsDialogConfirmOpen(true);

	const handleConfirmSignOut = async ({ openState, isConfirmed }: { openState: boolean, isConfirmed: boolean }) => {
		if (!isConfirmed) {
			setIsDialogConfirmOpen(openState);
			return;
		}
		try {
			setIsLoading(true);
			await signOut({ redirect: false });
			setIsDialogConfirmOpen(openState);
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
					<LogOut
						className="text-destructive"
						size="16"
					/> 
				}
				type="button"
				variant="destructive"
				onClick={ handleSignOut }
			>
				Log out
			</ButtonItem>
			<DialogConfirm
				description="Are you sure you want to log out ?"
				isLoading={ isLoading }
				open={ isDialogConfirmOpen }
				title="Log out"
				variant="destructive"
				onOpenChange={ handleConfirmSignOut }
			/>
		</>
	);
};

export default LogOutButton;