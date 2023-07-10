import { SortingState } from '@tanstack/react-table';

import { CreateUserDTO, IUser, UpdateUserDTO } from '@/types/user.type';
import fetcher, { FetcherOptions } from '@/utils/fetcher.util';
import { objectToFormData } from '@/utils/object.utils';

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
} & FetcherOptions;

export const fetchUsers = async (options?: FetchUsersOptions): Promise<{ users: IUser[], total: number, count: number }> => {
	const { sort, skip, limit, search, ...restOptions } = options ? options : {
		sort: undefined,
		skip: undefined,
		limit: undefined,
		search: undefined,
	};
	const sortQuery = sort && sort.length > 0 ? `sort_fields=${ sort.map(el => el.id).join(',') }&sort_directions=${ sort.map(el => el.desc ? -1 : 1).join(',') }` : '';
	const skipQuery = skip ? `skip=${ skip }` : '';
	const limitQuery = limit ? `limit=${ limit }` : '';
	const searchQuery = search ? `search=${ search }` : '';
	let query = '';
	if (sortQuery || skipQuery || limitQuery || searchQuery) {
		query = `?${ sortQuery }${ sortQuery && skipQuery ? `&${ skipQuery }` : skipQuery }${ (sortQuery || skipQuery) && limitQuery ? `&${ limitQuery }` : limitQuery }${ (sortQuery || skipQuery || limitQuery) && searchQuery ? `&${ searchQuery }` : searchQuery }`;
	}
	try {
		const data = await fetcher(`/api/users/${ query }`, restOptions);
		return data;
	} catch (error) {
		throw error;
	}
};