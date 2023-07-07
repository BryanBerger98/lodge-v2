/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, object, string, z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { resetUserPassword } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type ResetPasswordFormProps = {
	csrfToken: string;
	verificationToken: string;
};

const ResetPasswordForm = ({ csrfToken, verificationToken }: ResetPasswordFormProps) => {

	const [ error, setError ] = useState<string | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const router = useRouter();

	const resetPasswordFormSchema = object({
		password: string().min(8, 'At least 8 characters.'),
		passwordConfirm: string().min(1, 'Required'),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: [ 'passwordConfirm' ],
		message: 'Must be the same as password.',
	});

	const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
		mode: 'onTouched',
	});

	const handleSubmitResetPasswordForm = async (values: z.infer<typeof resetPasswordFormSchema>) => {
		const { password } = values;
		try {
			setIsLoading(true);
			setError(null);
			await resetUserPassword(verificationToken, password, csrfToken);
			router.replace('/signin');
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof resetPasswordFormSchema>;
						const [ inputName ] = issue.path;
						form.setError(inputName.toString() as IssueName, { message: issue.message });
					});
				}
			}
			setError(getErrorMessage(apiError));
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="min-w-[420px]">
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitResetPasswordForm) }>
						<CardHeader>
							<CardTitle>Reset your password</CardTitle>
							<CardDescription>
								Use this form to set a new password. You will need to sign in after updating your password.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={ form.control }
								name="password"
								render={ ({ field }) => (
									<FormItem className="mb-4">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												{ ...field }
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								) }
							/>
							<FormField
								control={ form.control }
								name="passwordConfirm"
								render={ ({ field }) => (
									<FormItem className="mb-4">
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input
												type="password"
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
								{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check /> }
								Submit
							</Button>
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

export default ResetPasswordForm;