'use client';

import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import useCsrf from '@/context/csrf/useCsrf';
import useSettings from '@/context/settings/useSettings';
import useErrorToast from '@/hooks/error/useErrorToast';
import { SettingName, UnregisteredSettingBooleanPopulated } from '@/schemas/setting';
import { updateSettings } from '@/services/settings.service';
import { ApiError } from '@/utils/api/error';
import { checkIfAtLeastOneBooleanSettingIsEnabled } from '@/utils/settings';

type SignInWithGoogleSettingButtonProps = {
	initialValue: UnregisteredSettingBooleanPopulated | null;
	isEnvProvided: boolean;
}

const SignInWithGoogleSettingButton = ({ initialValue, isEnvProvided }: SignInWithGoogleSettingButtonProps) => {

	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDialogOpen, setIsDialogOpen ] = useState(false);
	const [ setting, setSetting ] = useState<UnregisteredSettingBooleanPopulated | null>(initialValue);

	const { refetchSettings, getSetting, getSettings } = useSettings();
	const { csrfToken } = useCsrf();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	const googleAuthSetting = getSetting(SettingName.GOOGLE_AUTH);
	const signInSettings = getSettings(SettingName.CREDENTIALS_SIGNIN, SettingName.MAGIC_LINK_SIGNIN);

	useEffect(() => {
		if (googleAuthSetting) {
			setSetting(googleAuthSetting);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ googleAuthSetting ]);

	const handleOpenDialog = () => setIsDialogOpen(true);
	const handleCancel = () => {
		setIsDialogOpen(false);
		setSetting(googleAuthSetting || initialValue);
	};

	const handleSubmit = async () => {
		if (!csrfToken) {
			triggerErrorToast({
				title: 'Error',
				message: 'Invalid CSRF token.',
			});
			setSetting(googleAuthSetting || initialValue);
			return;
		}
		if (!setting) {
			return;
		}
		if (!setting.value) {
			if (!checkIfAtLeastOneBooleanSettingIsEnabled(...signInSettings)) {
				triggerErrorToast({
					title: 'Error',
					description: 'At least one sign in provider must be enabled.',
				});
				setSetting(googleAuthSetting || initialValue);
				return;
			}
		}
		try {
			setIsLoading(true);
			await updateSettings([
				{
					name: setting.name,
					data_type: setting.data_type,
					value: setting.value,
				},
			], { csrfToken });
			await refetchSettings();
			setIsDialogOpen(false);
			toast({
				title: 'Success',
				description: 'Settings updated.',
			});
		} catch (error) {
			triggerErrorToast(error as ApiError<unknown>);
			setSetting(googleAuthSetting || initialValue);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (value: string) => {
		setSetting(setting ? {
			...setting,
			value: value === 'on',
		} : null);
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
					disabled={ !isEnvProvided }
					value={ !isEnvProvided ? <span className="text-destructive">Needs environment variables</span> : setting?.value ? 'On' : 'Off' }
					onClick={ handleOpenDialog }
				>
					Sign in with Google
				</ButtonItem>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Sign in with Google</DialogTitle>
					<DialogDescription>Allow users to sign in with their Google account.</DialogDescription>
				</DialogHeader>
				<div className="space-y-2 py-4">
					<Select
						value={ setting?.value ? 'on' : 'off' }
						onValueChange={ handleChange }
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="on">On</SelectItem>
							<SelectItem value="off">Off</SelectItem>
						</SelectContent>
					</Select>
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
						type="button"
						onClick={ handleSubmit }
					>
						{ isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="w-4 h-4" /> }
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SignInWithGoogleSettingButton;