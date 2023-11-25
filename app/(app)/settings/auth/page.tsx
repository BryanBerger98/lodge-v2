import { KeyRound } from 'lucide-react';

import ButtonList from '@/components/ui/Button/ButtonList';
import { Heading2 } from '@/components/ui/Typography/heading';
import { Paragraph } from '@/components/ui/Typography/text';
import { findSettingByName } from '@/database/setting/setting.repository';
import { SettingName, UnregisteredSettingBooleanPopulatedSchema } from '@/schemas/setting';
import { Env } from '@/utils/env.util';

import SignInWithAppleSettingButton from './_components/Buttons/SignInWithAppleSettingButton';
import SignInWithDiscordSettingButton from './_components/Buttons/SignInWithDiscordSettingButton';
import SignInWithFacebookSettingButton from './_components/Buttons/SignInWithFacebookSettingButton';
import SignInWithGitHubSettingButton from './_components/Buttons/SignInWithGithubSettingButton';
import SignInWithGitLabSettingButton from './_components/Buttons/SignInWithGitlabSettingButton';
import SignInWithGoogleSettingButton from './_components/Buttons/SignInWithGoogleSettingButton';
import SignInWithLinkedInSettingButton from './_components/Buttons/SignInWithLinkedInSettingButton';
import SignInWithMicrosoftSettingButton from './_components/Buttons/SignInWithMicrosoftSettingButton';
import SignInWithSlackSettingButton from './_components/Buttons/SignInWithSlackSettingButton';
import SignInWithXSettingButton from './_components/Buttons/SignInWithXSettingButton';
import CredentialsProviderSetting from './_components/CredentialsProviderSetting';
import MagicLinkProviderSetting from './_components/MagicLinkProviderSetting';

export const dynamic = 'force-dynamic';

const AuthSettingsPage = async () => {

	const isGoogleAuthEnvProvided = Env.GOOGLE_CLIENT_ID && Env.GOOGLE_CLIENT_SECRET ? true : false;

	const credentialsSignInSettingData = await findSettingByName(SettingName.CREDENTIALS_SIGNIN);
	const magicLinkSignInSettingData = await findSettingByName(SettingName.MAGIC_LINK_SIGNIN);
	const googleAuthSettingData = await findSettingByName(SettingName.GOOGLE_AUTH);

	const credentialsSignInSetting = UnregisteredSettingBooleanPopulatedSchema.parse(credentialsSignInSettingData);
	const magicLinkSignInSetting = UnregisteredSettingBooleanPopulatedSchema.parse(magicLinkSignInSettingData);
	const googleAuthSetting = UnregisteredSettingBooleanPopulatedSchema.parse(googleAuthSettingData);

	return (
		<div className="flex flex-col gap-8 lg:w-1/2">
			<Heading2 className="flex gap-2 items-center"><KeyRound /> Authentication settings</Heading2>
			<div className="space-y-4">
				<Paragraph variant="lead">Providers settings</Paragraph>
				<CredentialsProviderSetting initialValue={ credentialsSignInSetting } />
				<MagicLinkProviderSetting initialValue={ magicLinkSignInSetting } />
				<ButtonList>
					<SignInWithGoogleSettingButton
						initialValue={ googleAuthSetting || null }
						isEnvProvided={ isGoogleAuthEnvProvided }
					/>
					<SignInWithAppleSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithMicrosoftSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithFacebookSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithLinkedInSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithXSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithDiscordSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithSlackSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithGitHubSettingButton
						isEnvProvided={ false }
					/>
					<SignInWithGitLabSettingButton
						isEnvProvided={ false }
					/>
				</ButtonList>
			</div>
		</div>
	);
};

export default AuthSettingsPage;