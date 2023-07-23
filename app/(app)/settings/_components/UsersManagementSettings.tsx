/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import useAuth from '@/context/auth/useAuth';
import useSettings from '@/context/settings/useSettings';

const usersSettingsFormSchema = z.object({
	can_new_user_signup: z.boolean().default(true).optional(),
	should_verify_email_on_signup: z.boolean().default(true).optional(),
	should_verify_email_on_update: z.boolean().default(true).optional(),
	can_user_delete_account: z.boolean().default(true).optional(),
});

type UsersManagementSettingsProps = {
	csrfToken: string;
};

const UsersManagementSettings = ({ csrfToken }: UsersManagementSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { getSetting, loading, refetchSettings } = useSettings();
	const { currentUser, fetchCurrentUser } = useAuth();

	const form = useForm<z.infer<typeof usersSettingsFormSchema>>({
		resolver: zodResolver(usersSettingsFormSchema),
		defaultValues: {
			can_new_user_signup: true,
			should_verify_email_on_signup: true,
			should_verify_email_on_update: true,
			can_user_delete_account: true,
		},
		mode: 'onTouched',
	});

	const handleSubmitUsersSettingsForm = (values: z.infer<typeof usersSettingsFormSchema>) => {
		console.log(values);
	};

	const handleCancel = () => {
		//
	};

	return (
		<Card>
			<Form { ...form }>
				<form onSubmit={ form.handleSubmit(handleSubmitUsersSettingsForm) }>
					<CardHeader>
						<CardTitle>Account settings</CardTitle>
						<CardDescription>Manage rules about users.</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={ form.control }
							name="can_new_user_signup"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Authorize new users
										</FormLabel>
										<FormDescription>
											New users can signup to the app.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											disabled={ loading === 'pending' }
											onBlur={ field.onBlur }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="should_verify_email_on_signup"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Email verification on signup
										</FormLabel>
										<FormDescription>
											New users must verify their email to access the whole app.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											disabled={ loading === 'pending' }
											onBlur={ field.onBlur }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="should_verify_email_on_signup"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Email verification on email update
										</FormLabel>
										<FormDescription>
											Users must verify their email to access the whole app again after updating their email address.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											disabled={ loading === 'pending' }
											onBlur={ field.onBlur }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="can_user_delete_account"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Allow users to delete their account
										</FormLabel>
										<FormDescription>
											Users can delete their account and all data relative to their account.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={ field.value }
											disabled={ loading === 'pending' }
											onBlur={ field.onBlur }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
								</FormItem>
							) }
						/>
					</CardContent>
					{
						currentUser?.role === 'owner' ?
							<CardFooter className="gap-4 justify-end">
								<Button
									className="gap-2"
									disabled={ loading === 'pending' }
									type="button"
									variant="outline"
									onClick={ handleCancel }
								>
									<X />
									Cancel
								</Button>
								<Button
									className="gap-2"
									disabled={ isLoading || loading === 'pending' }
									type="submit"
								>
									{ isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save /> }
									Save
								</Button>
							</CardFooter>
							: null
					}
				</form>
			</Form>
		</Card>
	);
};

export default UsersManagementSettings;