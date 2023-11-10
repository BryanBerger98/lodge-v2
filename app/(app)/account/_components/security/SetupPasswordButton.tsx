'use client';

import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { sendResetPasswordToken } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';


const SetupPasswordButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ message, setMessage ] = useState<string>('Launch the reset password workflow to setup a password.');
	const [ error, setError ] = useState<string | null>(null);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const setupPasswordOpen = searchParams.get('setup_password');

	const { currentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	useEffect(() => {
		if (setupPasswordOpen === 'open') {
			if (!isDialogOpen) {
				setIsDialogOpen(true);
			}
		}
	}, [ setupPasswordOpen, isDialogOpen ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSendResetPasswordToken = async () => {
		if (!currentUser) {
			return;
		}
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		const { email } = currentUser;
		try {
			setIsLoading(true);
			setError(null);
			await sendResetPasswordToken(email, { csrfToken });
			setMessage('We have sent an email to your inbox. If you have not receive it, wait at least 1 minute to send it again.');
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			setError(getErrorMessage(apiError));
		} finally {
			setIsLoading(false);
		}
	};

	const handleDialogOpenChange = (open: boolean) => {
		if (!isLoading) {
			setIsDialogOpen(open);
			router.push(`/account/security?setup_password=${ open ? 'open' : 'close' }`);
		}
	};

	return (
		<>
			<Dialog
				open={ isDialogOpen }
				onOpenChange={ handleDialogOpenChange }
			>
				<DialogTrigger asChild>
					<ButtonItem
						value="Setup password"
						onClick={ handleOpenDialog }
					>
						Password
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Setup password</DialogTitle>
						<DialogDescription>{ message }</DialogDescription>
					</DialogHeader>
					{ error ?
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>
								{ error }
							</AlertDescription>
						</Alert>
						: null }
					<DialogFooter className="sm:justify-center">
						<Button
							className="gap-2"
							disabled={ isLoading }
							type="button"
							onClick={ handleSendResetPasswordToken }
						>
							{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size="16" /> }
							Send me a link !
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SetupPasswordButton;