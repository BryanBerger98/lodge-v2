import useSWR from 'swr';

import { ISetting } from '@/types/setting.type';
import fetcher from '@/utils/fetcher.util';

export type FetchSettingsResponse = {
	settings: ISetting[],
};

const useFetchSettings = () => {

	const { data, error, isLoading, mutate } = useSWR<FetchSettingsResponse>('/api/settings', fetcher);

	return {
		data,
		error,
		isLoading,
		refetch: mutate,
	};

};

export default useFetchSettings;