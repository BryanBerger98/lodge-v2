'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithDiscordSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithDiscordSettingButton = ({ isEnvProvided }: SignInWithDiscordSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with Discord
		</ButtonItem>
	);
};

export default SignInWithDiscordSettingButton;