'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';

import { SignInContext, SignInContextValue, SignInStep, verifyIfSignInStepExists } from '.';

type SignInProviderProps = {
	children: ReactNode;
}

const SignInProvider = ({ children }: SignInProviderProps) => {

	const searchParams = useSearchParams();
	const signInStep = searchParams.get('step');
	const doesSignInStepExist = verifyIfSignInStepExists(signInStep || '');

	const [ error, setError ] = useState<string | null>(null);
	const [ step, setStep ] = useState<SignInStep>(doesSignInStepExist ? signInStep as SignInStep : SignInStep.EMAIL);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ email, setEmail ] = useState<string>('');

	const signInContextValue: SignInContextValue = useMemo(() => ({
		step,
		setStep,
		error,
		setError,
		isLoading,
		setIsLoading,
		email,
		setEmail,
	}), [ step, error, isLoading, email ]);

	return (
		<SignInContext.Provider value={ signInContextValue }>
			{ children }
		</SignInContext.Provider>
	);
};

export default SignInProvider;