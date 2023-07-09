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