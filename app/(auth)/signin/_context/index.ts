import { Dispatch, SetStateAction, createContext } from 'react';

export enum SignInStep {
	EMAIL = 'email',
	PASSWORD = 'password',
	MAGIC_EMAIL_SENT = 'magic-email-sent',
}

export const verifyIfSignInStepExists = (step: string): step is SignInStep => {
	return Object.values(SignInStep).includes(step as SignInStep);
};

export type SignInContextValue = {
	step: SignInStep,
	setStep: Dispatch<SetStateAction<SignInStep>>,
	error: string | null,
	setError: Dispatch<SetStateAction<string | null>>,
	isLoading: boolean,
	setIsLoading: Dispatch<SetStateAction<boolean>>,
	email: string;
	setEmail: Dispatch<SetStateAction<string>>,
};

export const SignInContext = createContext<SignInContextValue | null>(null);