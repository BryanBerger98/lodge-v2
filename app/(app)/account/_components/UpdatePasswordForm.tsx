/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, object, string, z } from 'zod';

import PasswordModal, { PasswordModalOpenChangeEvent } from '@/components/features/auth/PasswordModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { updateUserPassword } from '@/services/auth.service';
import { ApiError, getErrorMessage } from '@/utils/error';

type UpdatePasswordFormProps = {
	csrfToken: string;
};

const UpdatePasswordForm = ({ csrfToken }: UpdatePasswordFormProps) => {

	const { toast } = useToast();

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false);

	const passwordFormSchema = object({ 
		password: string().min(8, 'At least 8 characters.'),
		passwordConfirm: string().min(1, 'Required'),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: [ 'passwordConfirm' ],
		message: 'Must be the same as password.',
	});

	const form = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
		mode: 'onTouched',
	});

	const handleSubmitEmailForm = () => {
		setIsPasswordModalOpen(true);
	};

	const handlePasswordModalOpenChange: PasswordModalOpenChangeEvent = async ({ openState, password }) => {
		const { password: newPassword } = form.getValues();

		if (!password) {
			setIsPasswordModalOpen(false);
			return;
		}
		
		try {
			setIsPasswordModalOpen(openState);
			setIsLoading(true);
			await updateUserPassword(password, newPassword, csrfToken);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			if (apiError.code === 'invalid-input') {
				const { data } = apiError as ApiError<ZodError>;
				if (data) {
					data.issues.forEach(issue => {
						type IssueName = keyof z.infer<typeof passwordFormSchema>;
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
			form.reset();
		}
	};

	return (
		<>
			<Card className="w-full">
				<Form { ...form }>
					<form
						className="flex"
						onSubmit={ form.handleSubmit(handleSubmitEmailForm) }
					>
						<CardHeader className="w-1/3">
							<CardTitle>Password</CardTitle>
							<CardDescription>
								Update your password.
							</CardDescription>
						</CardHeader>
						<div className="w-2/3">
							<CardContent className="pt-6">
								<FormField
									control={ form.control }
									name="password"
									render={ ({ field }) => (
										<FormItem className="mb-4">
											<FormLabel>New password</FormLabel>
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
										<FormItem>
											<FormLabel>Confirm new password</FormLabel>
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
				isOpen={ isPasswordModalOpen }
				onOpenChange={ handlePasswordModalOpenChange }
			/>
		</>
	);
};

export default UpdatePasswordForm;