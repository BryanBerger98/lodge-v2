'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithFacebookSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithFacebookSettingButton = ({ isEnvProvided }: SignInWithFacebookSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with Facebook
		</ButtonItem>
	);
};

export default SignInWithFacebookSettingButton;