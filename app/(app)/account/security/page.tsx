import { Lock } from 'lucide-react';

import ButtonList from '@/components/ui/Button/ButtonList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading4 } from '@/components/ui/Typography/heading';
import { findSettingByName } from '@/database/setting/setting.repository';
import { connectToDatabase } from '@/lib/database';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema, UnregisteredSettingNumberPopulatedSchema } from '@/schemas/setting';
import { setServerAuthGuard } from '@/utils/auth';

import PasswordButton from '../_components/security/PasswordButton';
import SetupPasswordButton from '../_components/security/SetupPasswordButton';

const AccountSecurityPage = async () => {

	await connectToDatabase();

	const { user: currentUser } = await setServerAuthGuard();

	const passwordLowercaseMinSettingData = await findSettingByName(SettingName.PASSWORD_LOWERCASE_MIN);
	const passwordLowercaseMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordLowercaseMinSettingData);
	const passwordUppercaseMinSettingData = await findSettingByName(SettingName.PASSWORD_UPPERCASE_MIN);
	const passwordUppercaseMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordUppercaseMinSettingData);
	const passwordNumbersMinSettingData = await findSettingByName(SettingName.PASSWORD_NUMBERS_MIN);
	const passwordNumbersMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordNumbersMinSettingData);
	const passwordSymbolsMinSettingData = await findSettingByName(SettingName.PASSWORD_SYMBOLS_MIN);
	const passwordSymbolsMinSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordSymbolsMinSettingData);
	const passwordMinLengthSettingData = await findSettingByName(SettingName.PASSWORD_MIN_LENGTH);
	const passwordMinLengthSetting = UnregisteredSettingNumberPopulatedSchema.parse(passwordMinLengthSettingData);
	const passwordUniqueCharsSettingData = await findSettingByName(SettingName.PASSWORD_UNIQUE_CHARS);
	const passwordUniqueCharsSetting = UnregisteredSettingBooleanPopulatedSchema.parse(passwordUniqueCharsSettingData);

	return (
		<>
			<Heading4 className="gap-2 flex items-center"><Lock size="16" />Security</Heading4>
			<Card>
				<CardHeader>
					<CardTitle>Authentication</CardTitle>
					<CardDescription>Manage your authentication methods.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ButtonList className="w-full">
						{
							currentUser.has_password ? (
								<PasswordButton
									passwordRules={ {
										uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
										lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
										numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
										symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
										min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
										should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
									} }
								/>
							) : null
						}
						{
							!currentUser.has_password ? (
								<SetupPasswordButton
									passwordRules={ {
										uppercase_min: passwordUppercaseMinSetting?.value !== undefined && passwordUppercaseMinSetting?.data_type === 'number' ? passwordUppercaseMinSetting?.value : 0,
										lowercase_min: passwordLowercaseMinSetting?.value !== undefined && passwordLowercaseMinSetting?.data_type === 'number' ? passwordLowercaseMinSetting?.value : 0,
										numbers_min: passwordNumbersMinSetting?.value !== undefined && passwordNumbersMinSetting?.data_type === 'number' ? passwordNumbersMinSetting?.value : 0,
										symbols_min: passwordSymbolsMinSetting?.value !== undefined && passwordSymbolsMinSetting?.data_type === 'number' ? passwordSymbolsMinSetting?.value : 0,
										min_length: passwordMinLengthSetting?.value !== undefined && passwordMinLengthSetting?.data_type === 'number' ? passwordMinLengthSetting?.value : 8,
										should_contain_unique_chars: passwordUniqueCharsSetting?.value !== undefined && passwordUniqueCharsSetting?.data_type === 'boolean' ? passwordUniqueCharsSetting?.value : false,
									} }
								/>
							) : null
						}
					</ButtonList>
				</CardContent>
			</Card>
		</>
	);
};

export default AccountSecurityPage;