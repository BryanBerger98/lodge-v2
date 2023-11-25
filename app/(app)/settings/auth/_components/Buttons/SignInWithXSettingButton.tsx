'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithXSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithXSettingButton = ({ isEnvProvided }: SignInWithXSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with X
		</ButtonItem>
	);
};

export default SignInWithXSettingButton;