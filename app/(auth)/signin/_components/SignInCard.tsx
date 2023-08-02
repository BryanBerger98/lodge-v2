'use client';

import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

const SignInSteps = [ 'email', 'password', 'magic-email-sent' ] as const;
type SignInStep = typeof SignInSteps[number];

type SignInContextValue = {
	step: SignInStep,
	setStep: Dispatch<SetStateAction<SignInStep>>,
	setError: Dispatch<SetStateAction<string | null>>,
	isLoading: boolean,
	setIsLoading: Dispatch<SetStateAction<boolean>>,
	email: string;
	setEmail: Dispatch<SetStateAction<string>>,
};

export const SignInContext = createContext<SignInContextValue | null>(null);

export const useSignInContext = () => {
	const context = useContext(SignInContext);
	if (context === null) {
		throw new Error('useSignInContext is null');
	}
	if (context === undefined) {
		throw new Error('useSignInContext was used outside of its Provider');
	}
	return context;
};

type SignInCardProps = {
	children: ReactNode;
}

const SignInCard = ({ children }: SignInCardProps) => {

	const searchParams = useSearchParams();
	const signInStep = searchParams.get('step');
	const doesSignInStepExist = searchParams.get('step') && SignInSteps.includes(searchParams.get('step') as SignInStep);

	const [ error, setError ] = useState<string | null>(null);
	const [ step, setStep ] = useState<SignInStep>(doesSignInStepExist ? signInStep as SignInStep : 'email');
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ email, setEmail ] = useState<string>('');

	const signInContextValue: SignInContextValue = useMemo(() => ({
		step,
		setStep,
		setError,
		isLoading,
		setIsLoading,
		email,
		setEmail,
	}), [ step, isLoading, email ]);

	return (
		<div className="flex flex-col gap-4 items-center">
			<Card className="lg:min-w-[420px]">
				<SignInContext.Provider value={ signInContextValue }>
					{ children }
				</SignInContext.Provider>
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

export default SignInCard;