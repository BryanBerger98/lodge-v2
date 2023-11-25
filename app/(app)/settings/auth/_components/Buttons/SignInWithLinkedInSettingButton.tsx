'use client';

import ButtonItem from '@/components/ui/Button/ButtonList/ButtonItem';

type SignInWithLinkedInSettingButtonProps = {
	isEnvProvided: boolean;
};

const SignInWithLinkedInSettingButton = ({ isEnvProvided }: SignInWithLinkedInSettingButtonProps ) => {

	return (
		<ButtonItem
			disabled={ !isEnvProvided }
			value="Coming soon"
		>
			Sign in with LinkedIn
		</ButtonItem>
	);
};

export default SignInWithLinkedInSettingButton;