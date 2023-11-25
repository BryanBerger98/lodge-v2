'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithMicrosoftSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithMicrosoftSettingButton = ({ isEnvProvided }: SignInWithMicrosoftSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with Microsoft
		</ButtonItem>
	);
};

export default SignInWithMicrosoftSettingButton;