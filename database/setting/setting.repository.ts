import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions } from '@/lib/database';
import { ISetting } from '@/types/setting.type';

import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModel from './setting.model';

export const findSettingByName = async (name: string): Promise<ISetting | null> => {
	try {
		const setting = await SettingModel.findOne({ name });
		return setting;
	} catch (error) {
		throw error;
	}
};

export const findSettings = async (query: FilterQuery<ISetting>): Promise<ISetting[]> => {
	try {
		const settings = await SettingModel.find(query).lean({ virtuals: [ 'id' ] });
		return settings;
	} catch (error) {
		throw error;
	}
};

export const createSetting = async (settingToCreate: CreateSettingDTO): Promise<ISetting> => {
	try {
		const createdSetting = await SettingModel.create(settingToCreate);
		return createdSetting;
	} catch (error) {
		throw error;
	}
};

export const updateSetting = async (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions): Promise<ISetting | null> => {
	try {
		const updatedSetting = await SettingModel.findOneAndUpdate({ name: settingToUpdate.name }, { $set: { ...settingToUpdate } }, {
			new: options?.newDocument || false,
			upsert: options?.upsert || false, 
		});
		return updatedSetting;
	} catch (error) {
		throw error;
	}
};