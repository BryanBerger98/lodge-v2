'use client';

import { User } from 'lucide-react';

import ButtonList from '@/components/ui/Button/ButtonList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading2 } from '@/components/ui/Typography/heading';
import { Paragraph } from '@/components/ui/Typography/text';
import useAuth from '@/context/auth/useAuth';

import BirthDateButton from './_components/profile/BirthDateButton';
import EmailButton from './_components/profile/EmailButton';
import GenderButton from './_components/profile/GenderButton';
import NameButton from './_components/profile/NameButton';
import PhoneNumberButton from './_components/profile/PhoneNumberButton';
import ProfilePicture from './_components/profile/ProfilePicture';
import UsernameButton from './_components/profile/UsernameButton';

const AccountPage = () => {

	const { currentUser } = useAuth();

	return (
		<>
			<Heading2 className="flex gap-2 items-center"><User /> Profile</Heading2>
			<Card>
				<CardHeader>
					<CardTitle>Personal informations</CardTitle>
					<CardDescription>Manage your personal informations.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-8 items-center">
					<div className="flex flex-col gap-4 items-center">
						<ProfilePicture />
						<div className="text-center">
							<Paragraph variant="large">{ currentUser?.first_name } { currentUser?.last_name }</Paragraph>
							<Paragraph
								className="capitalize"
								variant="muted"
							>{ currentUser?.role }
							</Paragraph>
						</div>
					</div>
					<ButtonList className="w-full">
						<NameButton />
						<UsernameButton />
						<GenderButton />
						<BirthDateButton />
						<EmailButton />
						<PhoneNumberButton />
					</ButtonList>
				</CardContent>
			</Card>
		</>
	);
};

export default AccountPage;