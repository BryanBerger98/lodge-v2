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

import DefaultAssignedRoleSettingButton from './Buttons/DefaultAssignedRoleSettingButton';

type AllowNewUsersToSignUpSettingProps = {
	initialValue: UnregisteredSettingBooleanPopulated;
};

const AllowNewUsersToSignUpSetting = ({ initialValue }: AllowNewUsersToSignUpSettingProps) => {

	const [ setting, setSetting ] = useState<UnregisteredSettingBooleanPopulated>(initialValue);
	const [ isLoading, setIsLoading ] = useState(false);

	const { csrfToken } = useCsrf();
	const { getSetting, refetchSettings } = useSettings();
	const { triggerErrorToast } = useErrorToast();
	const { toast } = useToast();

	const newUserSignUpSetting = getSetting(SettingName.NEW_USERS_SIGNUP);
	const defaultUserRoleSetting = getSetting(SettingName.DEFAULT_USER_ROLE);

	useEffect(() => {
		if (newUserSignUpSetting) {
			setSetting(newUserSignUpSetting);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ newUserSignUpSetting ]);

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
			return;
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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border p-4 mb-4 space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<Paragraph variant="medium">Allow new users to sign up</Paragraph>
					<Paragraph variant="muted">New users can signup to the app.</Paragraph>
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
						<DefaultAssignedRoleSettingButton initialValue={ defaultUserRoleSetting || null } />
					</ButtonList>
				) : null
			}
		</div>
	);
};

export default AllowNewUsersToSignUpSetting;