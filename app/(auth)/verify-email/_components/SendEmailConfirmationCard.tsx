'use client';

import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSentEmailVerificationToken, sendEmailVerificationToken } from '@/services/auth.service';
import { SafeTokenData } from '@/types/token.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { TOKEN_NOT_FOUND_ERROR } from '@/utils/error/error-codes';

let intervalId: NodeJS.Timer | null = null;

type SendEmailConfirmationCardProps = {
	csrfToken: string;
}

const SendEmailConfirmationCard = ({ csrfToken }: SendEmailConfirmationCardProps) => {

	const [ emailVerificationTokenData, setEmailVerificationTokenData ] = useState<SafeTokenData | null>(null);
	const [ resendEmailCountDown, setResendEmailCountDown ] = useState(0);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState('');

	useEffect(() => {
		const getEmailVerificationToken = async () => {
			setIsLoading(true);
			try {
				const tokenData = await getSentEmailVerificationToken();
				setEmailVerificationTokenData(tokenData);
			} catch (error) {
				const apiError = error as ApiError<unknown>;
				if (apiError.code === TOKEN_NOT_FOUND_ERROR) {
					const tokenData = await sendEmailVerificationToken(csrfToken);
					setEmailVerificationTokenData(tokenData);
				} else {
					console.error(apiError);
					setError(getErrorMessage(apiError));
				}
			} finally {
				setIsLoading(false);
			}
		};
		getEmailVerificationToken();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}

		if (emailVerificationTokenData) {
			setError('');
			const tokenCreationTimestamp = new Date(emailVerificationTokenData.created_at).getTime();
			const now = Date.now();
			const timeDiff = Math.round((now - tokenCreationTimestamp) / 1000);
			if (timeDiff < 60) {
				setResendEmailCountDown(60 - timeDiff);
				intervalId = setInterval(() => {
					setResendEmailCountDown(prevCountDown => prevCountDown > 0 ? prevCountDown - 1 : prevCountDown);
				}, 1000);
			}
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			} 
		};

	}, [ emailVerificationTokenData ]);

	const handleSendNewTokenByEmail = async () => {
		try {
			setIsLoading(true);
			setError('');
			const token = await sendEmailVerificationToken(csrfToken);
			setEmailVerificationTokenData(token);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			console.error(apiError);
			setError(getErrorMessage(apiError));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="min-w-[420px]">
			<CardHeader>
				<CardTitle>Email verification</CardTitle>
				<CardDescription>
					Check your inbox to confirm your email address.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{
					resendEmailCountDown === 0 ?
						<p>If you have not receive the confirmation email, you can send a new one.</p>
						:
						<>
							<p className="font-bold mb-2">Check your inbox!</p>
							<p>If you have not receive the confirmation email, wait <span className="font-bold">{ resendEmailCountDown } seconds</span> before sending a new one.</p>
						</>
				}
			</CardContent>
			<CardFooter className="flex-col gap-4">
				<Button
					className="gap-2"
					disabled={ isLoading || resendEmailCountDown > 0 }
					type="button"
					onClick={ handleSendNewTokenByEmail }
				>
					{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send /> }
					Resend an email
				</Button>
				{ error ? <p className="text-red-500 flex gap-2 items-center"><AlertCircle /> { error }</p> : null }
			</CardFooter>
		</Card>
	);
};

export default SendEmailConfirmationCard;