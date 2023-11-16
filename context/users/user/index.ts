import { Dispatch, SetStateAction, createContext } from 'react';

import { UserPopulated } from '@/schemas/user/populated.schema';

type UserContextValues = {
	user: UserPopulated | null;
	setUser: Dispatch<SetStateAction<UserPopulated | null>>;
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	refetchUser: (id?: string) => Promise<UserPopulated | null | undefined>;
}

const UserContext = createContext<UserContextValues | null>(null);
export default UserContext;