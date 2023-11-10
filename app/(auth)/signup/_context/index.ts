import { Dispatch, SetStateAction, createContext } from 'react';

export enum SignUpStep {
	EMAIL = 'email',
	PASSWORD = 'password',
	MAGIC_EMAIL_SENT = 'magic-email-sent',
}

export const verifyIfSignUpStepExists = (step: string): step is SignUpStep => {
	return Object.values(SignUpStep).includes(step as SignUpStep);
};

export type SignUpContextValue = {
	step: SignUpStep,
	setStep: Dispatch<SetStateAction<SignUpStep>>,
	error: string | null,
	setError: Dispatch<SetStateAction<string | null>>,
	isLoading: boolean,
	setIsLoading: Dispatch<SetStateAction<boolean>>,
	email: string;
	setEmail: Dispatch<SetStateAction<string>>,
};

export const SignUpContext = createContext<SignUpContextValue | null>(null);