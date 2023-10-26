import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { SettingPopulated } from '@/schemas/setting';

export type FetchSettingsResponse = {
	settings: SettingPopulated[],
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