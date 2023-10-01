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

const providersSettingsFormSchema = z.object({
	magic_link_signin: z.boolean().default(true),
	google_auth: z.boolean().default(false), 
});

type ProvidersSettingsProps = {
	csrfToken: string;
	isGoogleAuthEnvProvided: boolean;
};

const ProvidersSettings = ({ csrfToken, isGoogleAuthEnvProvided }: ProvidersSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { getSetting, loading, refetchSettings } = useSettings();;

	const magicLinkSigninSetting = getSetting(SETTING_NAMES.MAGIC_LINK_SIGNIN_SETTING);
	const googleAuthSetting = getSetting(SETTING_NAMES.GOOGLE_AUTH_SETTING);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof providersSettingsFormSchema>>({
		resolver: zodResolver(providersSettingsFormSchema),
		defaultValues: {
			magic_link_signin: true,
			google_auth: true, 
		},
		mode: 'onTouched',
	});

	const handleSetDefaultValues = () => {
		form.setValue('magic_link_signin', magicLinkSigninSetting?.value !== undefined ? magicLinkSigninSetting.value : true);
		form.setValue('google_auth', googleAuthSetting?.value !== undefined ? googleAuthSetting.value : false);
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ magicLinkSigninSetting?.value ]);

	const handleSubmitProvidersForm = async ({ magic_link_signin, google_auth }: z.infer<typeof providersSettingsFormSchema>) => {
		try {
			setIsLoading(true);
			const settingsValues: (UnregisteredSetting & { settingName: string, settingValue: boolean | string | number | undefined })[] = [
				{
					settingName: magicLinkSigninSetting?.name || SETTING_NAMES.MAGIC_LINK_SIGNIN_SETTING,
					settingValue: magicLinkSigninSetting?.value,
					name: 'magic_link_signin',
					value: magic_link_signin,
					data_type: 'boolean',
				},
				{
					settingName: googleAuthSetting?.name || SETTING_NAMES.GOOGLE_AUTH_SETTING,
					settingValue: googleAuthSetting?.value,
					name: 'google_auth',
					value: google_auth,
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
		<>
			<Card>
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit(handleSubmitProvidersForm) }>
						<CardHeader>
							<CardTitle>Auth providers settings</CardTitle>
							<CardDescription>Manage how users can sign in to your app.</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={ form.control }
								name="magic_link_signin"
								render={ ({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Sign in with magic link
											</FormLabel>
											<FormDescription>
												Allow users to sign in with a link sent by email.
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
								name="google_auth"
								render={ ({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Authentication with Google
											</FormLabel>
											<FormDescription>
												Allow users to authenticate with Google.
												{ !isGoogleAuthEnvProvided && <p className="text-destructive">Needs environment variables to be enabled.</p> }
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={ field.value }
												disabled={ !isGoogleAuthEnvProvided || loading === 'pending' }
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
		</>
	);
};

export default ProvidersSettings;