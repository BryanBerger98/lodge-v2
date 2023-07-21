import { ISetting, UnregisteredSetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import fetcher from '@/utils/fetcher.util';

export type ShareSettings = {
	settings: {
		shareWithAdmin: ISetting,
		owner: ISetting,
	},
	ownerUser: IUser,
};

export const getShareSettings = async (): Promise<ShareSettings> => {
	try {
		const data = await fetcher('/api/settings/share');
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateSettings = async (settings: UnregisteredSetting[], csrfToken: string): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/settings', {
			method: 'PUT',
			body: JSON.stringify({ settings }),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateShareSettings = async (settings: UnregisteredSetting[], csrfToken: string, password: string): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/settings/share', {
			method: 'PUT',
			body: JSON.stringify({
				settings,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};