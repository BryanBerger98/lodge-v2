'use client';

import { AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

import { useSignUp } from '../_context/useSignUp';

type SignUpCardProps = {
	children: ReactNode;
}

const SignUpCard = ({ children }: SignUpCardProps) => {

	const { error } = useSignUp();

	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="lg:min-w-[420px]">
				{ children }
			</Card>
			{ error ?
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{ error }
					</AlertDescription>
				</Alert>
				: null }
		</div>
	);
};

export default SignUpCard;