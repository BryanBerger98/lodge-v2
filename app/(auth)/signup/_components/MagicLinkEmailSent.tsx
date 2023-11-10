'use client';

import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { SignUpStep } from '../_context';
import { useSignUp } from '../_context/useSignUp';

const MagicEmailSent = () => {

	const { step, setStep, email } = useSignUp();

	const handleGoBack = () => setStep(SignUpStep.PASSWORD);

	if (step !== SignUpStep.MAGIC_EMAIL_SENT) {
		return null;
	}

	return (
		<>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					Sign up with <span className="font-bold">{ email }</span>.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>
					An email was to your inbox at <span className="font-bold">{ email }</span>.
				</p>
				<p>
					Please check it out to sign in!
				</p>
			</CardContent>
			<CardFooter className="flex-col gap-4">
				<Separator orientation="horizontal" />
				<div className="flex w-full justify-between">
					<Button
						className="gap-2 items-center"
						variant="link"
						onClick={ handleGoBack }
					>
						<ChevronLeft /> Back
					</Button>
				</div>
			</CardFooter>
		</>
	);
};

export default MagicEmailSent;