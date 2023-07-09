import { SortingState } from '@tanstack/react-table';

import { CreateUserDTO, IUser } from '@/types/user.type';
import fetcher from '@/utils/fetcher.util';

export const createUser = async (userToCreate: CreateUserDTO, csrfToken?: string | null): Promise<IUser> => {
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
}

export const fetchUsers = async (options?: FetchUsersOptions): Promise<{ users: IUser[], total: number, count: number }> => {
	const sortQuery = options?.sort && options.sort.length > 0 ? `sort_fields=${ options.sort.map(el => el.id).join(',') }&sort_directions=${ options.sort.map(el => el.desc ? -1 : 1).join(',') }` : '';
	const skipQuery = options?.skip ? `skip=${ options.skip }` : '';
	const limitQuery = options?.limit ? `limit=${ options.limit }` : '';
	const searchQuery = options?.search ? `search=${ options.search }` : '';
	let query = '';
	if (sortQuery || skipQuery || limitQuery || searchQuery) {
		query = `?${ sortQuery }${ sortQuery && skipQuery ? `&${ skipQuery }` : skipQuery }${ (sortQuery || skipQuery) && limitQuery ? `&${ limitQuery }` : limitQuery }${ (sortQuery || skipQuery || limitQuery) && searchQuery ? `&${ searchQuery }` : searchQuery }`;
	}
	try {
		const data = await fetcher(`/api/users/${ query }`);
		return data;
	} catch (error) {
		throw error;
	}
};