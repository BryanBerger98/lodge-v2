import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Text } from '@react-email/text';
import * as React from 'react';

import { User } from '@/schemas/user';
import { UserPopulated } from '@/schemas/user/populated.schema';

type ResetPasswordProps = {
	user: Partial<User | UserPopulated>;
	tokenLink: string;
	appName?: string;
};

const ResetPassword = ({ user = { username: 'John DOE' }, tokenLink = 'https://lodge.weberger.net', appName = 'Lodge' }: ResetPasswordProps) => {
	return (
		<Tailwind>
			<Html
				className="bg-white font-sans"
			>
				<Head>
					<title>{ appName } - Reset your password</title>
				</Head>
				<Container>
					<Heading>Reset your password</Heading>
					<Text>Hi{ user.username ? ` ${ user.username }!` : '!' }</Text>
					<Text>Password reset has been triggered from your account.</Text>
					<Text>You can update your password by clicking on the link below.</Text>
					<Button
						href={ tokenLink }
						pX={ 20 }
						pY={ 12 }
						style={ {
							background: '#000',
							color: '#fff',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 6,
							fontWeight: 500,
						} }
					>
						Reset my password
					</Button>
					<Text>This link will be expired in 2 hours.</Text>
					<Text>If you are not the author of this action, please contact the app administrator.</Text>
					<Text>Thanks!</Text>
					<Text>{ appName } team</Text>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default ResetPassword;