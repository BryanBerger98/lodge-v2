import { SortingState } from '@tanstack/react-table';
import { z } from 'zod';

import { CreateUserSchema } from '@/app/api/users/_schemas/create-user.schema';
import { UpdateUserSchema } from '@/app/api/users/_schemas/update-user.schema';
import fetcher, { FetcherOptions } from '@/lib/fetcher';
import { Role } from '@/schemas/role.schema';
import { User, UserPopulated } from '@/schemas/user';
import { SafeTokenData } from '@/types/token.type';
import { objectToFormData } from '@/utils/object.utils';
import { buildQueryUrl } from '@/utils/url.util';

export const createUser = async (userToCreate: z.infer<typeof CreateUserSchema> & { avatar?: File | Blob | null }, csrfToken: string, options?: FetcherOptions): Promise<UserPopulated> => {
	try {
		const formData = new FormData();
		formData.append('username', userToCreate.username);
		formData.append('email', userToCreate.email);
		formData.append('phone_number', userToCreate.phone_number);
		formData.append('role', userToCreate.role);
		formData.append('is_disabled', userToCreate.is_disabled.toString());
		if (userToCreate.avatar) {
			formData.append('avatar', userToCreate.avatar);
		}
		const data = await fetcher('/api/users', {
			method: 'POST',
			body: formData,
			...options,
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateUser = async (userToUpdate: z.infer<typeof UpdateUserSchema> & { avatar?: File | Blob | null }, csrfToken: string, options?: FetcherOptions): Promise<UserPopulated> => {
	try {
		const formData = objectToFormData({ ...userToUpdate });
		const data = await fetcher('/api/users', {
			method: 'PUT',
			body: formData,
			...options,
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateMultipleUsers = async (usersToUpdate: z.infer<typeof UpdateUserSchema>[], csrfToken: string, options?: FetcherOptions): Promise<User> => {
	try {
		const data = await fetcher('/api/users/bulk', {
			method: 'PUT',
			body: JSON.stringify(usersToUpdate),
			headers: { 'Content-Type': 'application/json' },
			...options,
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export type FetchUsersOptions = {
	sort?: SortingState,
	skip?: number;
	limit?: number;
	search?: string;
	roles?: Role[];
} & FetcherOptions;

export const fetchUsers = async (options?: FetchUsersOptions): Promise<{ users: UserPopulated[], total: number, count: number }> => {
	const { sort = [], skip, limit, search, roles = [], ...restOptions } = options ? options : {
		sort: [],
		skip: undefined,
		limit: undefined,
		search: undefined,
		roles: [],
	};

	const query = buildQueryUrl({
		sort_fields: sort.map(el => el.id).join(','),
		sort_directions: sort.map(el => el.desc ? -1 : 1).join(','),
		limit,
		skip,
		search,
		roles: roles.join(','),
	});

	try {
		const data = await fetcher(`/api/users/${ query }`, restOptions);
		return data;
	} catch (error) {
		throw error;
	}
};

export const deleteUser = async (user_id: string, csrfToken: string, options?: FetcherOptions): Promise<void> => {
	try {
		await fetcher(`/api/users/${ user_id }`, {
			method: 'DELETE',
			...options,
			csrfToken,
		});
		return;
	} catch (error) {
		throw error;
	}
};

export const deleteMultipleUsers = async (user_ids: (string)[], csrfToken: string, options?: FetcherOptions): Promise<void> => {
	try {
		await fetcher(`/api/users/bulk/${ user_ids.join(',') }`, {
			method: 'DELETE',
			...options,
			csrfToken,
		});
		return;
	} catch (error) {
		throw error;
	}
};

export const sendResetPasswordTokenToUser = async (user_id: string, csrfToken: string): Promise<SafeTokenData> => {
	try {
		const data = await fetcher(`/api/users/${ user_id }/reset-password`, {
			method: 'POST',
			csrfToken, 
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendVerificationTokenToUser = async (user_id: string, csrfToken: string): Promise<SafeTokenData> => {
	try {
		const data = await fetcher(`/api/users/${ user_id }/verify-email`, {
			method: 'POST',
			csrfToken, 
		});
		return data;
	} catch (error) {
		throw error;
	}
};