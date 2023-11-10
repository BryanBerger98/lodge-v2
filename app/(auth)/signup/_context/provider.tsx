'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';

import { SignUpContext, SignUpContextValue, SignUpStep, verifyIfSignUpStepExists } from '.';

type SignUpProviderProps = {
	children: ReactNode;
}

const SignUpProvider = ({ children }: SignUpProviderProps) => {

	const searchParams = useSearchParams();
	const signInStep = searchParams.get('step');
	const doesSignUpStepExist = verifyIfSignUpStepExists(signInStep || '');

	const [ error, setError ] = useState<string | null>(null);
	const [ step, setStep ] = useState<SignUpStep>(doesSignUpStepExist ? signInStep as SignUpStep : SignUpStep.EMAIL);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ email, setEmail ] = useState<string>('');

	const signInContextValue: SignUpContextValue = useMemo(() => ({
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
		<SignUpContext.Provider value={ signInContextValue }>
			{ children }
		</SignUpContext.Provider>
	);
};

export default SignUpProvider;