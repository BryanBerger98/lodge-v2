'use client';

import { Dispatch, SetStateAction, createContext } from 'react';

import { IUserPopulated } from '@/schemas/user/populated.schema';

type UserContextValues = {
	user: IUserPopulated | null;
	setUser: Dispatch<SetStateAction<IUserPopulated | null>>;
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	refetchUser: (id?: string) => Promise<IUserPopulated | null | undefined>;
}

const UserContext = createContext<UserContextValues | null>(null);
export default UserContext;