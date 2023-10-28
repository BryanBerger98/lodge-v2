'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
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
import { updateUserPassword } from '@/services/auth.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessageFromPasswordRules, getValidationRegexFromPasswordRules } from '@/utils/password.util';

type PasswordButtonProps = {
	passwordRules: {
		uppercase_min: number;
		lowercase_min: number;
		numbers_min: number;
		symbols_min: number;
		min_length: number;
		should_contain_unique_chars: boolean;
	};
};

export const PasswordButton = ({ passwordRules }: PasswordButtonProps) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { currentUser, updateCurrentUser } = useAuth();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();

	const PasswordFormSchema = z.object({ 
		password: z.string().min(1, 'Required.'),
		newPassword: z.string().min(passwordRules.min_length, `At least ${ passwordRules.min_length } characters.`).regex(getValidationRegexFromPasswordRules(passwordRules), { message: getErrorMessageFromPasswordRules(passwordRules) }),
		newPasswordConfirm: z.string().min(1, 'Required.'),
	}).refine((data) => data.newPassword === data.newPasswordConfirm, {
		path: [ 'newPasswordConfirm' ],
		message: 'Must be the same as the new password.',
	});

	type PasswordFormValues = z.infer<typeof PasswordFormSchema>;

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(PasswordFormSchema),
		defaultValues: {
			password: '',
			newPassword: '',
			newPasswordConfirm: '',
		},
		mode: 'onTouched',
	});

	const handleOpenDialog = () => setIsDialogOpen(true);

	const handleSubmit = async (values: PasswordFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const updatedUser = await updateUserPassword(values, { csrfToken });
			await updateCurrentUser(updatedUser);
			form.reset();
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
						value="Change your password"
						onClick={ handleOpenDialog }
					>
						Password
					</ButtonItem>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<Form { ...form }>
						<form onSubmit={ form.handleSubmit(handleSubmit) }>
							<DialogHeader>
								<DialogTitle>Password</DialogTitle>
							</DialogHeader>
							<div className="py-4 space-y-4">
								<FormField
									control={ form.control }
									name="password"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Current password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													{ ...field }
												/>
											</FormControl>
											<FormDescription>
												To set new password, you need to enter your current password.
											</FormDescription>
											<FormMessage />
										</FormItem>
									) }
								/>
								<FormField
									control={ form.control }
									name="newPassword"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>New password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
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
									name="newPasswordConfirm"
									render={ ({ field }) => (
										<FormItem>
											<FormLabel>Confirm new password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													{ ...field }
												/>
											</FormControl>
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

export default PasswordButton;