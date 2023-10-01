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
import useSettings from '@/context/settings/useSettings';
import { updateSettings } from '@/services/settings.service';
import { UnregisteredSetting } from '@/types/setting.type';
import { ApiError, getErrorMessage } from '@/utils/error';
import { SETTING_NAMES } from '@/utils/settings';

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

	const passwordLowercaseMinSetting = getSetting(SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING);
	const passwordUppercaseMinSetting = getSetting(SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING);
	const passwordNumbersMinSetting = getSetting(SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING);
	const passwordSymbolsMinSetting = getSetting(SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING);
	const passwordMinLengthSetting = getSetting(SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING);
	const passwordUniqueCharsSetting = getSetting(SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING);

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
					settingName: passwordLowercaseMinSetting?.name || SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING,
					settingValue: passwordLowercaseMinSetting?.value,
					name: SETTING_NAMES.PASSWORD_LOWERCASE_MIN_SETTING,
					value: values.lowercase_min,
					data_type: 'number',
				},
				{
					settingName: passwordUppercaseMinSetting?.name || SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING,
					settingValue: passwordUppercaseMinSetting?.value,
					name: SETTING_NAMES.PASSWORD_UPPERCASE_MIN_SETTING,
					value: values.uppercase_min,
					data_type: 'number',
				},
				{
					settingName: passwordNumbersMinSetting?.name || SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING,
					settingValue: passwordNumbersMinSetting?.value,
					name: SETTING_NAMES.PASSWORD_NUMBERS_MIN_SETTING,
					value: values.numbers_min,
					data_type: 'number',
				},
				{
					settingName: passwordSymbolsMinSetting?.name || SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING,
					settingValue: passwordSymbolsMinSetting?.value,
					name: SETTING_NAMES.PASSWORD_SYMBOLS_MIN_SETTING,
					value: values.symbols_min,
					data_type: 'number',
				},
				{
					settingName: passwordMinLengthSetting?.name || SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING,
					settingValue: passwordMinLengthSetting?.value,
					name: SETTING_NAMES.PASSWORD_MIN_LENGTH_SETTING,
					value: values.min_length,
					data_type: 'number',
				},
				{
					settingName: passwordUniqueCharsSetting?.name || SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING,
					settingValue: passwordUniqueCharsSetting?.value,
					name: SETTING_NAMES.PASSWORD_UNIQUE_CHARS_SETTING,
					value: values.should_contain_unique_chars,
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