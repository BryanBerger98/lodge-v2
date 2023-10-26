import { z } from 'zod';

import { UpdateImageSettingSchema } from '@/app/api/settings/_schemas/update-image.setting.schema';
import fetcher, { FetcherOptions, FetcherOptionsWithCsrf } from '@/lib/fetcher';
import { Setting, SettingName, SettingPopulated } from '@/schemas/setting';
import { UnregisteredSetting } from '@/schemas/setting/unregistered-setting.schema';
import { User } from '@/schemas/user';
import { objectToFormData } from '@/utils/object.utils';
import { buildQueryUrl } from '@/utils/url.util';

export type ShareSettings = {
	settings: {
		shareWithAdmin: Setting,
		owner: Setting,
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

export const fetchSettings = async (options?: FetchSettingsOptions): Promise<Setting[]> => {

	const { name = '', ...restOptions } = options ? options : { name: '' };

	const query = buildQueryUrl({ name: name && Array.isArray(name) ? name.join(',') : name && typeof name === 'string' ? name : '' });
	try {
		const data = await fetcher(`/api/settings${ query }`, restOptions);
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateSettings = async (settings: UnregisteredSetting[], options: FetcherOptionsWithCsrf): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/settings', {
			method: 'PUT',
			body: JSON.stringify({ settings }),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateImageSetting = async (setting: z.infer<typeof UpdateImageSettingSchema>, options: FetcherOptionsWithCsrf): Promise<{ message: string }> => {
	try {
		const formData = objectToFormData({ ...setting });
		const data = await fetcher('/api/settings/image', {
			method: 'PUT',
			body: formData,
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const deleteImageSetting = async (setting_name: SettingName, options: FetcherOptionsWithCsrf): Promise<SettingPopulated | null> => {
	try {
		const data = await fetcher(`/api/settings/image/${ setting_name }`, {
			method: 'DELETE',
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateShareSettings = async ({ settings, password }: { settings: UnregisteredSetting[], password: string }, options: FetcherOptionsWithCsrf): Promise<{ message: string }> => {
	try {
		const data = await fetcher('/api/settings/share', {
			method: 'PUT',
			body: JSON.stringify({
				settings,
				password, 
			}),
			headers: { 'Content-Type': 'application/json' },
			...options,
		});
		return data;
	} catch (error) {
		throw error;
	}
};