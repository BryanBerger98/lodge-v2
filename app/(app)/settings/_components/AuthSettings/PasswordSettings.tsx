/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useSettings from '@/context/settings/useSettings';;
import { UnregisteredSetting, SettingName, SettingDataType } from '@/schemas/setting';
import { updateSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';
import { getErrorMessage } from '@/utils/api/error/error-messages.util';

const passwordSettingsFormSchema = z.object({
	uppercase_min: z.coerce.number().default(0),
	lowercase_min: z.coerce.number().default(0),
	numbers_min: z.coerce.number().default(0),
	symbols_min: z.coerce.number().default(0),
	min_length: z.coerce.number().default(8),
	should_contain_unique_chars: z.boolean().default(false),
});
type PasswordSettingsProps = {
	csrfToken: string;
};

const PasswordSettings = ({ csrfToken }: PasswordSettingsProps) => {

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	
	const { getSetting, loading, refetchSettings } = useSettings();

	const passwordLowercaseMinSetting = getSetting(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordUppercaseMinSetting = getSetting(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordNumbersMinSetting = getSetting(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordSymbolsMinSetting = getSetting(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordMinLengthSetting = getSetting(SettingName.PASSWORD_MIN_LENGTH);
	const passwordUniqueCharsSetting = getSetting(SettingName.PASSWORD_UNIQUE_CHARS);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof passwordSettingsFormSchema>>({
		resolver: zodResolver(passwordSettingsFormSchema),
		defaultValues: {
			uppercase_min: 0,
			lowercase_min: 0,
			numbers_min: 0,
			symbols_min: 0,
			min_length: 8,
			should_contain_unique_chars: false,
		},
		mode: 'onTouched',
	});

	const handleSetDefaultValues = () => {
		form.setValue('uppercase_min', passwordLowercaseMinSetting?.value !== undefined ? passwordLowercaseMinSetting.value : 0);
		form.setValue('lowercase_min', passwordUppercaseMinSetting?.value !== undefined ? passwordUppercaseMinSetting.value : 0);
		form.setValue('numbers_min', passwordNumbersMinSetting?.value !== undefined ? passwordNumbersMinSetting.value : 0);
		form.setValue('symbols_min', passwordSymbolsMinSetting?.value !== undefined ? passwordSymbolsMinSetting.value : 0);
		form.setValue('min_length', passwordMinLengthSetting?.value !== undefined ? passwordMinLengthSetting.value : 8);
		form.setValue('should_contain_unique_chars', passwordUniqueCharsSetting?.value !== undefined ? passwordUniqueCharsSetting.value : false);
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		passwordLowercaseMinSetting?.value,
		passwordUppercaseMinSetting?.value,
		passwordNumbersMinSetting?.value,
		passwordSymbolsMinSetting?.value,
		passwordMinLengthSetting?.value,
		passwordUniqueCharsSetting?.value,
	]);

	const handleSubmitPasswordSettingsForm = async (values: z.infer<typeof passwordSettingsFormSchema>) => {
		try {
			setIsLoading(true);
			const settingsValues: (UnregisteredSetting & { settingName: string, settingValue: boolean | string | number | undefined })[] = [
				{
					settingName: passwordLowercaseMinSetting?.name || SettingName.PASSWORD_LOWERCASE_MIN,
					settingValue: passwordLowercaseMinSetting?.value,
					name: SettingName.PASSWORD_LOWERCASE_MIN,
					value: values.lowercase_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: passwordUppercaseMinSetting?.name || SettingName.PASSWORD_UPPERCASE_MIN,
					settingValue: passwordUppercaseMinSetting?.value,
					name: SettingName.PASSWORD_UPPERCASE_MIN,
					value: values.uppercase_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: passwordNumbersMinSetting?.name || SettingName.PASSWORD_NUMBERS_MIN,
					settingValue: passwordNumbersMinSetting?.value,
					name: SettingName.PASSWORD_NUMBERS_MIN,
					value: values.numbers_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: passwordSymbolsMinSetting?.name || SettingName.PASSWORD_SYMBOLS_MIN,
					settingValue: passwordSymbolsMinSetting?.value,
					name: SettingName.PASSWORD_SYMBOLS_MIN,
					value: values.symbols_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: passwordMinLengthSetting?.name || SettingName.PASSWORD_MIN_LENGTH,
					settingValue: passwordMinLengthSetting?.value,
					name: SettingName.PASSWORD_MIN_LENGTH,
					value: values.min_length,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: passwordUniqueCharsSetting?.name || SettingName.PASSWORD_UNIQUE_CHARS,
					settingValue: passwordUniqueCharsSetting?.value,
					name: SettingName.PASSWORD_UNIQUE_CHARS,
					value: values.should_contain_unique_chars,
					data_type: SettingDataType.BOOLEAN,
				},
			];
			const settingsToUpdate: UnregisteredSetting[] = settingsValues
				.filter(setting => setting.value !== undefined && setting.value !== setting.settingValue)
				.map(setting => ({
					name: setting.settingName,
					value: setting.value,
					data_type: setting.data_type,
				})) as UnregisteredSetting[];
			await updateSettings(settingsToUpdate, { csrfToken });
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
				<form
					onSubmit={ form.handleSubmit(handleSubmitPasswordSettingsForm) }
				>
					<CardHeader>
						<CardTitle>Password rules</CardTitle>
						<CardDescription>
							Manage password rules.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={ form.control }
							name="uppercase_min"
							render={ ({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Uppercase characters</FormLabel>
									<FormControl>
										<Input
											min={ 0 }
											placeholder="Number of uppercase characters"
											type="number"
											{ ...field }
										/>
									</FormControl>
									<FormDescription>
										The minimum of uppercase characters required in password. Set <code>0</code> to disable the rule.
									</FormDescription>
									<FormMessage />
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="lowercase_min"
							render={ ({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Lowercase characters</FormLabel>
									<FormControl>
										<Input
											min={ 0 }
											placeholder="Number of lowercase characters"
											type="number"
											{ ...field }
										/>
									</FormControl>
									<FormDescription>
										The minimum of lowercase characters required in password. Set <code>0</code> to disable the rule.
									</FormDescription>
									<FormMessage />
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="numbers_min"
							render={ ({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Numeric characters</FormLabel>
									<FormControl>
										<Input
											min={ 0 }
											placeholder="Number of numeric characters"
											type="number"
											{ ...field }
										/>
									</FormControl>
									<FormDescription>
										The minimum of numeric characters required in password. Set <code>0</code> to disable the rule.
									</FormDescription>
									<FormMessage />
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="symbols_min"
							render={ ({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Symbol characters</FormLabel>
									<FormControl>
										<Input
											min={ 0 }
											placeholder="Number of symbol characters"
											type="number"
											{ ...field }
										/>
									</FormControl>
									<FormDescription>
										The minimum of symbol characters required in password. Set <code>0</code> to disable the rule.
									</FormDescription>
									<FormMessage />
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="min_length"
							render={ ({ field }) => (
								<FormItem className="mb-6">
									<FormLabel>Minimum length</FormLabel>
									<FormControl>
										<Input
											min={ 8 }
											placeholder="Number of characters required"
											type="number"
											{ ...field }
										/>
									</FormControl>
									<FormDescription>
										The minimum of characters required in password. <code>8</code> is set by default.
									</FormDescription>
									<FormMessage />
								</FormItem>
							) }
						/>
						<FormField
							control={ form.control }
							name="should_contain_unique_chars"
							render={ ({ field }) => (
								<FormItem className="flex items-center gap-4">
									<FormControl>
										<Switch
											checked={ field.value }
											onCheckedChange={ field.onChange }
										/>
									</FormControl>
									<FormLabel className="!m-0">
										Only unique characters
									</FormLabel>
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

export default PasswordSettings;