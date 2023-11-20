'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import ButtonList from '@/components/ui/Button/ButtonList';
import { Switch } from '@/components/ui/switch';
import { Paragraph } from '@/components/ui/Typography/text';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { SettingName, UnregisteredSettingBooleanPopulated } from '@/schemas/setting';
import { updateSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';
import { checkIfAtLeastOneBooleanSettingIsEnabled } from '@/utils/settings';

import PasswordRulesSettingsButton from './Buttons/PasswordRulesSettingsButton';

type CredentialsProviderSettingProps = {
	initialValue: UnregisteredSettingBooleanPopulated;
};

const CredentialsProviderSetting = ({ initialValue }: CredentialsProviderSettingProps) => {

	const [ setting, setSetting ] = useState<UnregisteredSettingBooleanPopulated>(initialValue);
	const [ isLoading, setIsLoading ] = useState(false);

	const { csrfToken } = useCsrf();
	const { getSetting, getSettings, refetchSettings } = useSettings();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	const credentialsSigninSetting = getSetting(SettingName.CREDENTIALS_SIGNIN);
	const passwordLowercaseMinSetting = getSetting(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordUppercaseMinSetting = getSetting(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordNumbersMinSetting = getSetting(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordSymbolsMinSetting = getSetting(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordMinLengthSetting = getSetting(SettingName.PASSWORD_MIN_LENGTH);
	const passwordUniqueCharsSetting = getSetting(SettingName.PASSWORD_UNIQUE_CHARS);

	const signInSettings = getSettings(SettingName.GOOGLE_AUTH, SettingName.MAGIC_LINK_SIGNIN);

	useEffect(() => {
		if (credentialsSigninSetting) {
			setSetting(credentialsSigninSetting);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ credentialsSigninSetting ]);

	const handleChangeSwitch = async (value: boolean) => {
		setSetting({
			...setting,
			value,
		});
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				description: 'Invalid CSRF token.',
			});
			setSetting(credentialsSigninSetting || initialValue);
			return;
		}
		if (!value) {
			if (!checkIfAtLeastOneBooleanSettingIsEnabled(...signInSettings)) {
				triggerErrorToast({
					title: 'Error',
					description: 'At least one sign in provider must be enabled.',
				});
				setSetting(credentialsSigninSetting || initialValue);
				return;
			}
		}
		try {
			setIsLoading(true);
			await updateSettings([
				{
					name: setting.name,
					data_type: setting.data_type,
					value,
				},
			], { csrfToken });
			await refetchSettings();
			toast({
				title: 'Success',
				description: 'Settings updated.',
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
			setSetting(credentialsSigninSetting || initialValue);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<Paragraph variant="medium">Sign in with credentials</Paragraph>
					<Paragraph variant="muted">Allow users to sign in with email and password.</Paragraph>
				</div>
				<div className="flex gap-2 items-center">
					{ isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null }
					<Switch
						checked={ setting.value }
						disabled={ isLoading }
						onCheckedChange={ handleChangeSwitch }
					/>
				</div>
			</div>
			{
				setting.value ? (
					<ButtonList>
						<PasswordRulesSettingsButton
							initialValues={ {
								uppercase_min: passwordUppercaseMinSetting || null,
								lowercase_min: passwordLowercaseMinSetting || null,
								numbers_min: passwordNumbersMinSetting || null,
								symbols_min: passwordSymbolsMinSetting || null,
								min_length: passwordMinLengthSetting || null,
								should_contain_unique_chars: passwordUniqueCharsSetting || null,
							} }
						/>
					</ButtonList>
				) : null
			}
		</div>
	);
};

export default CredentialsProviderSetting;