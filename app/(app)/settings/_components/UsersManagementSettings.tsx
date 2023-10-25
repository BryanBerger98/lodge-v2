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
import { SETTING_NAMES } from '@/utils/settings';

const usersSettingsFormSchema = z.object({
	can_new_user_signup: z.boolean().default(true),
	should_verify_email: z.boolean().default(true),
	can_user_delete_account: z.boolean().default(true),
});

type UsersManagementSettingsProps = {
	csrfToken: string;
};

const UsersManagementSettings = ({ csrfToken }: UsersManagementSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { getSetting, loading, refetchSettings } = useSettings();

	const newUserSignupSetting = getSetting(SETTING_NAMES.NEW_USERS_SIGNUP_SETTING);
	const userVerifyEmailSetting = getSetting(SETTING_NAMES.USER_VERIFY_EMAIL_SETTING);
	const userAccountDeletionSetting = getSetting(SETTING_NAMES.USER_ACCOUNT_DELETION_SETTING);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof usersSettingsFormSchema>>({
		resolver: zodResolver(usersSettingsFormSchema),
		defaultValues: {
			can_new_user_signup: true,
			should_verify_email: true,
			can_user_delete_account: true,
		},
		mode: 'onTouched',
	});

	const handleSetDefaultValues = () => {
		form.setValue('can_new_user_signup', newUserSignupSetting?.value !== undefined ? newUserSignupSetting.value : true);
		form.setValue('should_verify_email', userVerifyEmailSetting?.value !== undefined ? userVerifyEmailSetting.value : true);
		form.setValue('can_user_delete_account', userAccountDeletionSetting?.value !== undefined ? userAccountDeletionSetting.value : true);
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		newUserSignupSetting?.value,
		userVerifyEmailSetting?.value,
		userAccountDeletionSetting?.value,
	]);

	const handleSubmitUsersSettingsForm = async ({ can_new_user_signup, should_verify_email, can_user_delete_account }: z.infer<typeof usersSettingsFormSchema>) => {
		try {
			setIsLoading(true);
			const settingsValues: (UnregisteredSetting & { settingName: string, settingValue: boolean | string | number | undefined })[] = [
				{
					settingName: newUserSignupSetting?.name || SETTING_NAMES.NEW_USERS_SIGNUP_SETTING,
					settingValue: newUserSignupSetting?.value,
					name: SETTING_NAMES.NEW_USERS_SIGNUP_SETTING,
					value: can_new_user_signup,
					data_type: 'boolean',
				},
				{
					settingName: userVerifyEmailSetting?.name || SETTING_NAMES.USER_VERIFY_EMAIL_SETTING,
					settingValue: userVerifyEmailSetting?.value,
					name: SETTING_NAMES.USER_VERIFY_EMAIL_SETTING,
					value: should_verify_email,
					data_type: 'boolean',
				},
				{
					settingName: userAccountDeletionSetting?.name || SETTING_NAMES.USER_ACCOUNT_DELETION_SETTING,
					settingValue: userAccountDeletionSetting?.value,
					name: SETTING_NAMES.USER_ACCOUNT_DELETION_SETTING,
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
				})) as UnregisteredSetting[];
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
							name="should_verify_email"
							render={ ({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Email verification
										</FormLabel>
										<FormDescription>
											Users must verify their email when they sign up or update their email address to access the whole app.
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