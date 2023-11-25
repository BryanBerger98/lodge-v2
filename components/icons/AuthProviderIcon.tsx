import { AuthenticationProvider } from '@/schemas/authentication-provider';

import AppleIcon from './apple';
import GoogleIcon from './google';
import { IconProps } from './icons.type';

const AuthProviderIcon = ({ size, authProvider, ...rest }: IconProps & { authProvider: AuthenticationProvider }) => {
	switch (authProvider) {
		case AuthenticationProvider.GOOGLE:
			return (
				<GoogleIcon
					size={ size }
					{ ...rest }
				/>
			);
		case AuthenticationProvider.APPLE:
			return (
				<AppleIcon
					size={ size }
					{ ...rest }
				/>)
			;
		default:
			return null;
	};
};

export default AuthProviderIcon;