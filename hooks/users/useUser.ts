import useSWR from 'swr';

import { IUserPopulated } from '@/schemas/user/populated.schema';
import { fetchUserById } from '@/services/users.service';
import { ApiError } from '@/utils/api/error';

const useUser = (userId?: string) => {

	const { data, error, isLoading, mutate } = useSWR<IUserPopulated>(userId, fetchUserById);

	return {
		data,
		error: error as ApiError<unknown>,
		isLoading,
		refetch: mutate,
	};
};

export default useUser;