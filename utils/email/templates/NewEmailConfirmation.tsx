import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Text } from '@react-email/text';
import * as React from 'react';

import { User } from '@/schemas/user';
import { IUserPopulated } from '@/schemas/user/populated.schema';

type NewEmailConfirmationProps = {
	user: Partial<User | IUserPopulated>;
	tokenLink: string;
	appName?: string;
};

const NewEmailConfirmation = ({ user = { username: 'John DOE' }, tokenLink = 'https://lodge.weberger.net', appName = 'Lodge' }: NewEmailConfirmationProps) => {
	return (
		<Tailwind>
			<Html
				className="bg-white font-sans"
			>
				<Head>
					<title>{ appName } - Confirm your new email</title>
				</Head>
				<Container>
					<Heading>Confirm your email address</Heading>
					<Text>Hi{ user.username ? ` ${ user.username }!` : '!' }</Text>
					<Text>We noticed that you want to update your email address.</Text>
					<Text>To confirm the update of your email address, we need you to verify your email address by clicking the link below.</Text>
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
						Confirm my new email
					</Button>
					<Text>Thanks!</Text>
					<Text>{ appName } team</Text>
				</Container>
			</Html>
		</Tailwind>
	);
};

export default NewEmailConfirmation;