'use client';

import { createContext } from 'react';
import { KeyedMutator } from 'swr';
import { z } from 'zod';

import { CreateUserSchema } from '@/app/api/users/_schemas/create-user.schema';
import { IUserPopulated } from '@/schemas/user/populated.schema';
import { ApiError } from '@/utils/api/error';

type UserContextValues = {
	user: IUserPopulated | null;
	isLoading: boolean;
	isMutating: boolean;
	refetchUser: KeyedMutator<IUserPopulated | null>;
	updateUser: (user: Partial<IUserPopulated>) => Promise<IUserPopulated | null>;
	createUser: (user: z.infer<typeof CreateUserSchema>) => Promise<IUserPopulated | null>;
	deleteUser: () => Promise<void>;
	error: ApiError<unknown> | undefined;
}

const UserContext = createContext<UserContextValues | null>(null);
export default UserContext;