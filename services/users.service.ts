import { SortingState } from '@tanstack/react-table';
import { z } from 'zod';

import { CreateUserSchema } from '@/app/api/users/_schemas/create-user.schema';
import { UpdateMultipleUsersSchema } from '@/app/api/users/_schemas/update-multiple-users.schema';
import { UpdateUserSchema } from '@/app/api/users/_schemas/update-user.schema';
import fetcher, { FetcherOptions, FetcherOptionsWithCsrf } from '@/lib/fetcher';
import { Role } from '@/schemas/role.schema';
import { ISafeToken, SafeTokenSchema } from '@/schemas/token.schema';
import { IUserPopulated, UserPopulatedSchema } from '@/schemas/user/populated.schema';
import { objectToFormData } from '@/utils/object.utils';
import { buildQueryUrl } from '@/utils/url.util';

export const createUser = async (userToCreate: z.infer<typeof CreateUserSchema>, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher('/api/users', {
			method: 'POST',
			body: objectToFormData({ ...userToCreate }),
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const updateUser = async (userToUpdate: z.infer<typeof UpdateUserSchema> & { id: string }, options: FetcherOptionsWithCsrf): Promise<IUserPopulated> => {
	try {
		const data = await fetcher(`/api/users/${ userToUpdate.id }`, {
			method: 'PUT',
			body: objectToFormData({ ...userToUpdate }),
			...options,
		});
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const updateMultipleUsers = async (usersToUpdate: z.infer<typeof UpdateMultipleUsersSchema>, options: FetcherOptionsWithCsrf): Promise<void> => {
	try {
		await fetcher('/api/users/bulk', {
			method: 'PUT',
			body: JSON.stringify(usersToUpdate),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return;
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

export const fetchUsers = async (options?: FetchUsersOptions): Promise<{ users: IUserPopulated[], total: number, count: number }> => {
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
		return z.object({
			users: z.array(UserPopulatedSchema),
			total: z.number(),
			count: z.number(),
		}).parse(data);
	} catch (error) {
		throw error;
	}
};

export const fetchUserById = async (user_id: string, options?: FetcherOptions): Promise<IUserPopulated> => {
	try {
		const data = await fetcher(`/api/users/${ user_id }`, options);
		return UserPopulatedSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const deleteUser = async (user_id: string, options: FetcherOptionsWithCsrf): Promise<void> => {
	try {
		await fetcher(`/api/users/${ user_id }`, {
			method: 'DELETE',
			...options,
		});
		return;
	} catch (error) {
		throw error;
	}
};

export const deleteMultipleUsers = async (user_ids: (string)[], options: FetcherOptionsWithCsrf): Promise<void> => {
	try {
		await fetcher(`/api/users/bulk/${ user_ids.join(',') }`, {
			method: 'DELETE',
			...options,
		});
		return;
	} catch (error) {
		throw error;
	}
};

export const sendResetPasswordTokenToUser = async (user_id: string, options: FetcherOptionsWithCsrf): Promise<ISafeToken> => {
	try {
		const data = await fetcher(`/api/users/${ user_id }/reset-password`, {
			method: 'POST',
			...options, 
		});
		return SafeTokenSchema.parse(data);
	} catch (error) {
		throw error;
	}
};

export const sendVerificationTokenToUser = async (user_id: string, options: FetcherOptionsWithCsrf): Promise<ISafeToken> => {
	try {
		const data = await fetcher(`/api/users/${ user_id }/verify-email`, {
			method: 'POST',
			...options, 
		});
		return SafeTokenSchema.parse(data);
	} catch (error) {
		throw error;
	}
};