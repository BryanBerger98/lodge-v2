'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuth from '@/context/auth/useAuth';
import useCsrf from '@/context/csrf/useCsrf';
import useErrorToast from '@/hooks/error/useErrorToast';
import { AuthenticationProvider } from '@/schemas/authentication-provider';
import { updateUserEmail } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';

const EmailFormSchema = z.object({
	email: z.string().email().min(1, 'Required.'),
	password: z.string().min(1, 'Required.'),
});

type EmailFormValues = z.infer<typeof EmailFormSchema>;

export const EmailButton = () => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const form = useForm<EmailFormValues>({
		resolver: zodResolver(EmailFormSchema),
		defaultValues: {
			email: currentUser?.email || '',
			password: '',
		},
		mode: 'onTouched',
	});

	useEffect(() => {
		if (currentUser) {
			form.setValue('email', currentUser.email);
			form.setValue('password', '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentUser?.id ]);

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async (values: EmailFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateUserEmail(values, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset({
				email: updatedUser.email,
				password: '', 
			});
			setIsDialogOpen(false);
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			triggerErrorToast(apiError, form);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDialogOpenChange = (open: boolean) => {
		if (!isLoading) {
			setIsDialogOpen(open);
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
						disabled={ currentUser?.provider_data !== AuthenticationProvider.EMAIL }
						value={ currentUser?.email }
						onClick={ handleOpenDialog }
					>
						Email
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Email</DialogTitle>
							</DialogHeader>
							<div className="py-4 space-y-4">
								<FormField
									control={ form.control }
									name="email"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="example@example.com"
													type="email"
													{ ...field }
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>
								<FormField
									control={ form.control }
									name="password"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													{ ...field }
												/>
											</FormControl>
											<FormDescription>
												To update your email, you need to enter your password.
											</FormDescription>
											<FormMessage />
										</FormItem>
									) }
								/>
							</div>
							<DialogFooter>
								<Button
									className="gap-2"
									disabled={ isLoading || !form.formState.isDirty || !form.formState.isValid }
									type="submit"
								>
									{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size="16" /> }
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EmailButton;