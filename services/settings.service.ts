import { ISetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { Optional } from '@/types/utils.type';
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

export const updateSettings = async (csrfToken: string, ...settings: Optional<ISetting, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>[]): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/settings', {
			method: 'PUT',
			body: JSON.stringify(settings),
			headers: { 'Content-Type': 'application/json' },
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};