/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useSettings from '@/context/settings/useSettings';
import { updateSettings } from '@/services/settings.service';
import { UnregisteredSetting } from '@/types/setting.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { NEW_USERS_SIGNUP_SETTING, USER_ACCOUNT_DELETION_SETTING, USER_VERIFY_EMAIL_SIGNUP_SETTING, USER_VERIFY_EMAIL_UPDATE_SETTING } from '@/utils/settings';

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

	const newUserSignupSetting = getSetting(NEW_USERS_SIGNUP_SETTING);
	const userVerifyEmailOnSignupSetting = getSetting(USER_VERIFY_EMAIL_SIGNUP_SETTING);
	const userVerifyEmailOnUpdateSetting = getSetting(USER_VERIFY_EMAIL_UPDATE_SETTING);
	const userAccountDeletionSetting = getSetting(USER_ACCOUNT_DELETION_SETTING);

	const { toast } = useToast();

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

	const handleSetDefaultValues = () => {
		form.setValue('can_new_user_signup', newUserSignupSetting?.value !== undefined ? newUserSignupSetting.value : true);
		form.setValue('should_verify_email_on_signup', userVerifyEmailOnSignupSetting?.value !== undefined ? userVerifyEmailOnSignupSetting.value : true);
		form.setValue('should_verify_email_on_update', userVerifyEmailOnUpdateSetting?.value !== undefined ? userVerifyEmailOnUpdateSetting.value : true);
		form.setValue('can_user_delete_account', userAccountDeletionSetting?.value !== undefined ? userAccountDeletionSetting.value : true);
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		newUserSignupSetting?.value,
		userVerifyEmailOnSignupSetting?.value,
		userVerifyEmailOnUpdateSetting?.value,
		userAccountDeletionSetting?.value,
	]);

	const handleSubmitUsersSettingsForm = async ({ can_new_user_signup, should_verify_email_on_signup, should_verify_email_on_update, can_user_delete_account }: z.infer<typeof usersSettingsFormSchema>) => {
		try {
			const settingsValues: (UnregisteredSetting & { settingName: string, settingValue: boolean | string | number | undefined })[] = [
				{
					settingName: newUserSignupSetting?.name || NEW_USERS_SIGNUP_SETTING,
					settingValue: newUserSignupSetting?.value,
					name: 'can_new_user_signup',
					value: can_new_user_signup,
					data_type: 'boolean',
				},
				{
					settingName: userVerifyEmailOnSignupSetting?.name || USER_VERIFY_EMAIL_SIGNUP_SETTING,
					settingValue: userVerifyEmailOnSignupSetting?.value,
					name: 'should_verify_email_on_signup',
					value: should_verify_email_on_signup,
					data_type: 'boolean',
				},
				{
					settingName: userVerifyEmailOnUpdateSetting?.name || USER_VERIFY_EMAIL_UPDATE_SETTING,
					settingValue: userVerifyEmailOnUpdateSetting?.value,
					name: 'should_verify_email_on_update',
					value: should_verify_email_on_update,
					data_type: 'boolean',
				},
				{
					settingName: userAccountDeletionSetting?.name || USER_ACCOUNT_DELETION_SETTING,
					settingValue: userAccountDeletionSetting?.value,
					name: 'can_user_delete_account',
					value: can_user_delete_account,
					data_type: 'boolean',
				},
			];
			const settingsToUpdate: UnregisteredSetting[] = settingsValues
				.filter(setting => setting.value !== undefined && setting.value !== setting.settingValue)
				.map(setting => ({
					name: setting.settingName,
					value: setting.value,
					data_type: setting.data_type,
				}));
			await updateSettings(settingsToUpdate, csrfToken);
			await refetchSettings();
		} catch (error) {
			const apiError = error as ApiError<unknown>;
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
											Allow new users signup
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
							name="should_verify_email_on_update"
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
					<CardFooter className="gap-4 justify-end">
						<Button
							className="gap-2"
							disabled={ loading === 'pending' }
							type="button"
							variant="outline"
							onClick={ handleSetDefaultValues }
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
				</form>
			</Form>
		</Card>
	);
};

export default UsersManagementSettings;