/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, object, string, z } from 'zod';

import PasswordModal, { PasswordModalOpenChangeEvent } from '@/components/features/auth/PasswordModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/context/auth/useAuth';
import { updateUserEmail } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type UpdateEmailFormProps = {
	csrfToken: string;
};

const UpdateEmailForm = ({ csrfToken }: UpdateEmailFormProps) => {

	const { toast } = useToast();

	const { currentUser, updateCurrentUser } = useAuth();

	const router = useRouter();

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);

	const emailFormSchema = object({ email: string().email('Please, provide a valid email address.').min(1, 'Required.') });

	const form = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: { email: currentUser?.email || '' },
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('email', currentUser.email || '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleSubmitEmailForm = ({ email }: z.infer<typeof emailFormSchema>) => {
		if (email !== currentUser?.email) {
			setIsPasswordModalOpen(true);
		}
	};

	const handlePasswordModalOpenChange: PasswordModalOpenChangeEvent = async ({ openState, password }) => {
		const { email } = form.getValues();

		if (!password) {
			setIsPasswordModalOpen(false);
			return;
		}
		
		try {
			setIsPasswordModalOpen(openState);
			setIsLoading(true);
			const updatedUser = await updateUserEmail(email, password, csrfToken);
			await updateCurrentUser(updatedUser);
			router.replace('/verify-email');
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof emailFormSchema>;
						const [ inputName ] = issue.path;
						if (inputName) {
							form.setError(inputName.toString() as IssueName, { message: issue.message });
						}
					});
				}
			}
			toast({
				title: 'Error',
				description: getErrorMessage(apiError),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Card className="w-full">
				<Form { ...form }>
					<form
						className="lg:flex"
						onSubmit={ form.handleSubmit(handleSubmitEmailForm) }
					>
						<CardHeader className="lg:w-1/3">
							<CardTitle>Email address</CardTitle>
							<CardDescription>
								Update your email address.
							</CardDescription>
						</CardHeader>
						<div className="lg:w-2/3">
							<CardContent className="lg:pt-6">
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
							<CardFooter className="flex-col gap-4 items-end">
								<Button
									className="gap-2"
									disabled={ isLoading }
									type="submit"
								>
									{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
									Save
								</Button>
							</CardFooter>
						</div>
					</form>
				</Form>
			</Card>
			<PasswordModal
				description={
					<>
						<p>Please verify that your email address is right: <span className="font-bold">{ form.getValues().email }</span>.</p>
						<p className="mb-4">We will send a validation link to your inbox.</p>
						<p>Enter your password to confirm the action.</p>
					</>
				}
				isOpen={ isPasswordModalOpen }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default UpdateEmailForm;