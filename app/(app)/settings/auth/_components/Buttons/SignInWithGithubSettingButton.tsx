'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithGitHubSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithGitHubSettingButton = ({ isEnvProvided }: SignInWithGitHubSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with GitHub
		</ButtonItem>
	);
};

export default SignInWithGitHubSettingButton;