import useSWR from 'swr';

import fetcher from '@/utils/fetcher.util';

const useFetchCurrentUser = () => {
	const { data, error, isLoading } = useSWR('/api/auth/account', fetcher);
   
	return {
	  user: data,
	  isLoading,
	  isError: error,
	};
};

export default useFetchCurrentUser;