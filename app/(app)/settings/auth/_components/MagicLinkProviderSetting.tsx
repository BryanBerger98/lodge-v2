'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

type MagicLinkProviderSettingProps = {
	initialValue: UnregisteredSettingBooleanPopulated;
};

const MagicLinkProviderSetting = ({ initialValue }: MagicLinkProviderSettingProps) => {

	const [ setting, setSetting ] = useState<UnregisteredSettingBooleanPopulated>(initialValue);
	const [ isLoading, setIsLoading ] = useState(false);

	const { csrfToken } = useCsrf();
	const { getSetting, getSettings, refetchSettings } = useSettings();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	const magicLinkSignInSetting = getSetting(SettingName.MAGIC_LINK_SIGNIN);
	const signInSettings = getSettings(SettingName.GOOGLE_AUTH, SettingName.CREDENTIALS_SIGNIN);

	useEffect(() => {
		if (magicLinkSignInSetting) {
			setSetting(magicLinkSignInSetting);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ magicLinkSignInSetting ]);

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
			setSetting(magicLinkSignInSetting || initialValue);
			return;
		}
		if (!value) {
			if (!checkIfAtLeastOneBooleanSettingIsEnabled(...signInSettings)) {
				triggerErrorToast({
					title: 'Error',
					description: 'At least one sign in provider must be enabled.',
				});
				setSetting(magicLinkSignInSetting || initialValue);
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
			setSetting(magicLinkSignInSetting || initialValue);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<Paragraph variant="medium">Sign in with magic link</Paragraph>
					<Paragraph variant="muted">Allow users to sign in with a link sent by email.</Paragraph>
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
		</div>
	);
};

export default MagicLinkProviderSetting;