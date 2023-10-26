import { z } from 'zod';

import { UpdateImageSettingSchema } from '@/app/api/settings/_schemas/update-image.setting.schema';
import fetcher, { FetcherOptions } from '@/lib/fetcher';
import { User } from '@/schemas/user';
import { ISetting, ISettingPopulated, IUnregisteredSetting } from '@/types/setting.type';
import { objectToFormData } from '@/utils/object.utils';
import { SettingImageName } from '@/utils/settings';
import { buildQueryUrl } from '@/utils/url.util';

export type ShareSettings = {
	settings: {
		shareWithAdmin: ISetting,
		owner: ISetting,
	},
	ownerUser: User,
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

export const deleteImageSetting = async (setting_name: SettingImageName, csrfToken: string): Promise<ISettingPopulated | null> => {
	try {
		const data = await fetcher(`/api/settings/image/${ setting_name }`, {
			method: 'DELETE',
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