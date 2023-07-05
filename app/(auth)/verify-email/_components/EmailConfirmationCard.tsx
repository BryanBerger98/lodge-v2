'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/context/auth/useAuth';

const EmailConfirmationCard = () => {

	const { currentUser } = useAuth();

	console.log(currentUser);

	return (
		<Card className="min-w-[420px]">
			<CardHeader>
				<CardTitle>Email verification</CardTitle>
				<CardDescription>
					We sent an email to your inbox to confirm your email address.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{
					// TODO => Add timer here
					// Get from backend the last date of the last sent verification email
					// TODO => Add verification check icon
				}
			</CardContent>
			<CardFooter className="flex-col gap-4">
				{
					// TODO => Add button
				}
			</CardFooter>
		</Card>
	);
};

export default EmailConfirmationCard;