'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithGitLabSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithGitLabSettingButton = ({ isEnvProvided }: SignInWithGitLabSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with GitLab
		</ButtonItem>
	);
};

export default SignInWithGitLabSettingButton;