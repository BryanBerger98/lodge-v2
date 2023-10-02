import { z } from 'zod';

import { UpdateImageSettingSchema } from '@/app/api/settings/_schemas/update-image.setting.schema';
import fetcher, { FetcherOptions } from '@/lib/fetcher';
import { ISetting, IUnregisteredSetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { objectToFormData } from '@/utils/object.utils';
import { buildQueryUrl } from '@/utils/url.util';

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

export type FetchSettingsOptions = {
	name?: string | string[]
} & FetcherOptions;

export const fetchSettings = async (options?: FetchSettingsOptions): Promise<ISetting[]> => {

	const { name = '', ...restOptions } = options ? options : { name: '' };

	const query = buildQueryUrl({ name: name && Array.isArray(name) ? name.join(',') : name && typeof name === 'string' ? name : '' });
	try {
		const data = await fetcher(`/api/settings${ query }`, restOptions);
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateSettings = async (settings: IUnregisteredSetting[], csrfToken: string): Promise<{ message: string }> => {
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

export const updateImageSetting = async (setting: z.infer<typeof UpdateImageSettingSchema>, csrfToken: string): Promise<{ message: string }> => {
	try {
		const formData = objectToFormData({ ...setting });
		const data = await fetcher('/api/settings/image', {
			method: 'PUT',
			body: formData,
			csrfToken,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateShareSettings = async (settings: IUnregisteredSetting[], csrfToken: string, password: string): Promise<{ message: string }> => {
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