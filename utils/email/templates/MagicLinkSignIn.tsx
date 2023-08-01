import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Text } from '@react-email/text';
import * as React from 'react';

type MagicLinkSignInProps = {
	tokenLink: string;
	appName?: string;
};

const MagicLinkSignIn = ({ tokenLink = 'https://lodge.weberger.net', appName = 'Lodge' }: MagicLinkSignInProps) => {
	return (
		<Tailwind>
			<Html
				className="bg-white font-sans"
			>
				<Head>
					<title>{ appName } - Sign in</title>
				</Head>
				<Container>
					<Heading>Sign in to { appName }</Heading>
					<Text>Hi!</Text>
					<Text>To access the app, we need you to sign in by clicking the link below.</Text>
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
						Sign in to { appName }
					</Button>
					<Text>Thanks!</Text>
					<Text>{ appName } team</Text>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default MagicLinkSignIn;