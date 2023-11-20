'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithAppleSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithAppleSettingButton = ({ isEnvProvided }: SignInWithAppleSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with Apple
		</ButtonItem>
	);
};

export default SignInWithAppleSettingButton;