/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, LogIn, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string, z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { sendResetPasswordToken } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';
import { buildFormError } from '@/utils/error';

type EmailFormProps = {
	csrfToken: string;
};

const EmailForm = ({ csrfToken }: EmailFormProps) => {

	const [ error, setError ] = useState<string | null>(null);
	const [ message, setMessage ] = useState<string | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const emailFormSchema = object({ email: string().email('Please, provide a valid email address.').min(1, 'Required.') });

	const form = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: { email: '' },
		mode: 'onTouched',
	});

	const handleSubmitEmailForm = async (values: z.infer<typeof emailFormSchema>) => {
		const { email } = values;
		try {
			setIsLoading(true);
			setError(null);
			await sendResetPasswordToken(email, { csrfToken });
			setMessage('We have sent an email to your inbox. If you have not receive it, wait at least 1 minute to send it again.');
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			buildFormError(apiError, { form });
			setError(getErrorMessage(apiError));
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="lg:min-w-[420px]">
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitEmailForm) }>
						<CardHeader>
							<CardTitle>You forgot your password ?</CardTitle>
							<CardDescription>
								Enter your email address to get a link allowing you to reset your password.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={ form.control }
								name="email"
								render={ ({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input
												placeholder="john@doe.com"
												{ ...field }
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								) }
							/>
						</CardContent>
						<CardFooter className="flex-col gap-4">
							<Button
								className="gap-2"
								disabled={ isLoading }
								type="submit"
							>
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send /> }
								Send me a link!
							</Button>
							{ message ? <p>{ message }</p> : null }
							<Separator orientation="horizontal" />
							<Button
								className="gap-2 items-center"
								variant="link"
								asChild
							>
								<Link href="/signin">
									<LogIn /> Sign in
								</Link>
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
			{ error ?
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{ error }
					</AlertDescription>
				</Alert>
				: null }
		</div>
	);
};

export default EmailForm;