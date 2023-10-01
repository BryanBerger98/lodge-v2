import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions, newId } from '@/lib/database';
import { ISetting, ISettingPopulated, UnregisteredSetting } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { SettingName, findDefaultSettingByName } from '@/utils/settings';

import UserModel from '../user/user.model';

import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModels from './setting.model';

export const findSettingByName = async (name: SettingName): Promise<ISetting | UnregisteredSetting | null> => {
	try {
		const document = await SettingModels.default.findOne({ name });
		if (!document) return findDefaultSettingByName(name) || null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findSettings = async (query: FilterQuery<ISetting>): Promise<ISettingPopulated[]> => {
	try {
		const settings = await SettingModels.default
			.find(query)
			.populate<{
			created_by: IUser;
			updated_by: IUser;
		}>([
			{
				path: 'created_by',
				select: { password: 0 },
				model: UserModel,
			},
			{
				path: 'updated_by',
				select: { password: 0 },
				model: UserModel,
			},
		])
			.lean({ virtuals: [ 'id' ] });
		return settings;
	} catch (error) {
		throw error;
	}
};

export const createSetting = async (settingToCreate: CreateSettingDTO): Promise<ISetting> => {
	try {
		const newSetting = new SettingModels[ settingToCreate.data_type ](settingToCreate);
		const document = await newSetting.save();
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const updateSetting = async (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions): Promise<ISetting | null> => {
	try {
		const document = await SettingModels.default.findOneAndUpdate({ name: settingToUpdate.name }, {
			$set: {
				...settingToUpdate,
				updated_by: settingToUpdate.updated_by ? newId(settingToUpdate.updated_by) : settingToUpdate.updated_by, 
			}, 
		}, {
			new: options?.newDocument || false,
			upsert: options?.upsert || false, 
		});
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};