import { SortingState } from '@tanstack/react-table';

import { Id } from '@/config/database.config';
import { SafeTokenData } from '@/types/token.type';
import { IUser, UserRole, UserRoleWithOwner } from '@/types/user.type';
import fetcher, { FetcherOptions } from '@/utils/fetcher.util';
import { objectToFormData } from '@/utils/object.utils';
import { buildQueryUrl } from '@/utils/url.util';

export type CreateUserDTO = {
	username: string;
	email: string;
	phone_number: string;
	role: UserRole;
	is_disabled: boolean;
	avatar?: File | Blob | null;
};

export const createUser = async (userToCreate: CreateUserDTO, csrfToken: string, options?: FetcherOptions): Promise<IUser> => {
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

type UpdateUserDTO = Partial<CreateUserDTO> & {
	id: Id | string;
}

export const updateUser = async (userToUpdate: UpdateUserDTO, csrfToken: string, options?: FetcherOptions): Promise<IUser> => {
	try {
		const formData = objectToFormData({
			...userToUpdate,
			id: typeof userToUpdate.id === 'string' ? userToUpdate.id : userToUpdate.id.toHexString(),
		});
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

export type FetchUsersOptions = {
	sort?: SortingState,
	skip?: number;
	limit?: number;
	search?: string;
	roles?: UserRoleWithOwner[];
} & FetcherOptions;

export const fetchUsers = async (options?: FetchUsersOptions): Promise<{ users: IUser[], total: number, count: number }> => {
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

export const deleteUser = async (userId: string | Id, csrfToken: string, options?: FetcherOptions): Promise<void> => {
	try {
		await fetcher(`/api/users/${ userId }`, {
			method: 'DELETE',
			...options,
			csrfToken,
		});
		return;
	} catch (error) {
		throw error;
	}
};

export const sendResetPasswordTokenToUser = async (userId: string | Id, csrfToken: string): Promise<SafeTokenData> => {
	try {
		const data = await fetcher(`/api/users/${ userId }/reset-password`, {
			method: 'POST',
			csrfToken, 
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const sendVerificationTokenToUser = async (userId: string | Id, csrfToken: string): Promise<SafeTokenData> => {
	try {
		const data = await fetcher(`/api/users/${ userId }/verify-email`, {
			method: 'POST',
			csrfToken, 
		});
		return data;
	} catch (error) {
		throw error;
	}
};