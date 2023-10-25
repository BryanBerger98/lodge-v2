import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { ISettingPopulated } from '@/types/setting.type';

export type FetchSettingsResponse = {
	settings: ISettingPopulated[],
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