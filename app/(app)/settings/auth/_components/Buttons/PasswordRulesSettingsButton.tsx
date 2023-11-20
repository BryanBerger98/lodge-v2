import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { SettingDataType, SettingName, UnregisteredSetting, UnregisteredSettingBooleanPopulated, UnregisteredSettingNumberPopulated } from '@/schemas/setting';
import { updateSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';

const PasswordRulesSettingsFormSchema = z.object({
	uppercase_min: z.coerce.number().default(0),
	lowercase_min: z.coerce.number().default(0),
	numbers_min: z.coerce.number().default(0),
	symbols_min: z.coerce.number().default(0),
	min_length: z.coerce.number().default(8),
	should_contain_unique_chars: z.boolean().default(false),
});

type PasswordRulesSettingsFormValues = z.infer<typeof PasswordRulesSettingsFormSchema>;

type PasswordRulesSettingsButtonProps = {
	initialValues: {
		uppercase_min: UnregisteredSettingNumberPopulated | null;
		lowercase_min: UnregisteredSettingNumberPopulated | null;
		numbers_min: UnregisteredSettingNumberPopulated | null;
		symbols_min: UnregisteredSettingNumberPopulated | null;
		min_length: UnregisteredSettingNumberPopulated | null;
		should_contain_unique_chars: UnregisteredSettingBooleanPopulated | null;
	}
}

const PasswordRulesSettingsButton = ({ initialValues }: PasswordRulesSettingsButtonProps) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);

	const { refetchSettings } = useSettings();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	const form = useForm<PasswordRulesSettingsFormValues>({
		resolver: zodResolver(PasswordRulesSettingsFormSchema),
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
		form.setValue('uppercase_min', initialValues.uppercase_min?.value !== undefined ? initialValues.uppercase_min.value : 0);
		form.setValue('lowercase_min', initialValues.lowercase_min?.value !== undefined ? initialValues.lowercase_min.value : 0);
		form.setValue('numbers_min', initialValues.numbers_min?.value !== undefined ? initialValues.numbers_min.value : 0);
		form.setValue('symbols_min', initialValues.symbols_min?.value !== undefined ? initialValues.symbols_min.value : 0);
		form.setValue('min_length', initialValues.min_length?.value !== undefined ? initialValues.min_length.value : 8);
		form.setValue('should_contain_unique_chars', initialValues.should_contain_unique_chars?.value !== undefined ? initialValues.should_contain_unique_chars.value : false);
	};

	useEffect(() => {
		handleSetDefaultValues();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ initialValues ]);

	const handleOpenDialog = () => setIsDialogOpen(true);
	const handleCancel = () => {
		setIsDialogOpen(false);
		handleSetDefaultValues();
	};

	const handleSubmit = async (values: PasswordRulesSettingsFormValues) => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			return;
		}
		try {
			setIsLoading(true);
			const settingsValues: (UnregisteredSetting & { settingName: string, settingValue: boolean | string | number | undefined })[] = [
				{
					settingName: initialValues.lowercase_min?.name || SettingName.PASSWORD_LOWERCASE_MIN,
					settingValue: initialValues.lowercase_min?.value,
					name: SettingName.PASSWORD_LOWERCASE_MIN,
					value: values.lowercase_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: initialValues.uppercase_min?.name || SettingName.PASSWORD_UPPERCASE_MIN,
					settingValue: initialValues.uppercase_min?.value,
					name: SettingName.PASSWORD_UPPERCASE_MIN,
					value: values.uppercase_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: initialValues.numbers_min?.name || SettingName.PASSWORD_NUMBERS_MIN,
					settingValue: initialValues.numbers_min?.value,
					name: SettingName.PASSWORD_NUMBERS_MIN,
					value: values.numbers_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: initialValues.symbols_min?.name || SettingName.PASSWORD_SYMBOLS_MIN,
					settingValue: initialValues.symbols_min?.value,
					name: SettingName.PASSWORD_SYMBOLS_MIN,
					value: values.symbols_min,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: initialValues.min_length?.name || SettingName.PASSWORD_MIN_LENGTH,
					settingValue: initialValues.min_length?.value,
					name: SettingName.PASSWORD_MIN_LENGTH,
					value: values.min_length,
					data_type: SettingDataType.NUMBER,
				},
				{
					settingName: initialValues.should_contain_unique_chars?.name || SettingName.PASSWORD_UNIQUE_CHARS,
					settingValue: initialValues.should_contain_unique_chars?.value,
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
			setIsDialogOpen(false);
			toast({
				title: 'Success',
				description: 'Settings updated.',
			});
		} catch (error) {
			const apiError = error as ApiError<unknown>;
			triggerErrorToast(apiError);
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
		<Dialog
			open={ isDialogOpen }
			onOpenChange={ handleDialogOpenChange }
		>
			<DialogTrigger asChild>
				<ButtonItem
					onClick={ handleOpenDialog }
				>
					Password rules
				</ButtonItem>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[95vh] no-scrollbar">
				<Form { ...form }>
					<form
						onSubmit={ form.handleSubmit(handleSubmit) }
					>
						<DialogHeader>
							<DialogTitle>Default assigned role</DialogTitle>
							<DialogDescription>Users who sign up will be assigned this role by default.</DialogDescription>
						</DialogHeader>
						<div className="py-4">
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
						</div>
						<DialogFooter>
							<Button
								disabled={ isLoading }
								type="button"
								variant="outline"
								onClick={ handleCancel }
							>
								<X className="w-4 h-4" />
								Cancel
							</Button>
							<Button
								disabled={ isLoading }
							>
								{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="w-4 h-4" /> }
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default PasswordRulesSettingsButton;