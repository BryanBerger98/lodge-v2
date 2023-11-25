'use client';

import { ArrowRight, CheckCircle2, Loader2, RefreshCcw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/context/auth/useAuth';
import { confirmNewUserEmail } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';

type ConfirmEmailCardProps = {
	csrfToken: string;
	verificationToken: string;
}

const ConfirmNewEmailCard = ({ csrfToken, verificationToken }: ConfirmEmailCardProps) => {

	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState('');

	const { currentUser, updateCurrentUser } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (currentUser) {
			setIsLoading(true);
			confirmNewUserEmail(verificationToken, { csrfToken })
				.then(({ email, new_email }) => {
					updateCurrentUser({
						...currentUser,
						email,
						new_email: new_email || null,
					})
						.catch(console.error)
						.then(() => {
							router.replace('/');
						});
				})
				.catch((error) => {
					const apiError = error as ApiError<unknown>;
					console.error(apiError);
					setError(getErrorMessage(apiError));
				})
				.finally(() => setIsLoading(false));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	return (
		<Card className="lg:min-w-[420px]">
			<CardHeader>
				<CardTitle>New email confirmation</CardTitle>
				<CardDescription>
					Your new email address is being confirmed.
				</CardDescription>
			</CardHeader>
			<CardContent>

				{
					isLoading ?
						<div className="flex flex-col items-center gap-2">
							<Loader2
								className="animate-spin"
								size="32"
							/>
							<p>We are updating your email...</p>
						</div> : null
				}

				{
					!isLoading && error ?
						<div className="flex flex-col items-center gap-2">
							<XCircle
								className="text-red-500"
								size="32"
							/>
							<p className="text-red-500">{ error }</p>
						</div> : null
				}

				{
					!isLoading && !error ?
						<div className="flex flex-col items-center gap-2">
							<CheckCircle2
								className="text-green-500"
								size="32"
							/>
							<p className="text-green-500">Your email has been successfully updated.</p>
						</div> : null
				}
			</CardContent>
			{
				!isLoading ?
					<CardFooter className="flex-col gap-4">
						{
							!error ?
								<Button
									className="gap-2"
									type="button"
								>
									Go back to the app <ArrowRight className="h-4 w-4" />
								</Button> : null
						}
						{
							error ?
								<Button
									className="gap-2"
									type="button"
									asChild
								>
									<Link href="/verify-email">
										<RefreshCcw className="h-4 w-4"/> Try confirming my new email again
									</Link>
								</Button> : null
						}
					</CardFooter> : null
			}
		</Card>
	);
};

export default ConfirmNewEmailCard;