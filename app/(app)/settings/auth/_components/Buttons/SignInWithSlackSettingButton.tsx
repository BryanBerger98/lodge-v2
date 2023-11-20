'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithSlackSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithSlackSettingButton = ({ isEnvProvided }: SignInWithSlackSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with Slack
		</ButtonItem>
	);
};

export default SignInWithSlackSettingButton;