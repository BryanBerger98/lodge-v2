import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions, newId } from '@/lib/database';
import { ISetting, ISettingPopulated } from '@/types/setting.type';
import { IUser } from '@/types/user.type';

import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModel from './setting.model';

export const findSettingByName = async (name: string): Promise<ISetting | null> => {
	try {
		const document = await SettingModel.findOne({ name });
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findSettings = async (query: FilterQuery<ISetting>): Promise<ISettingPopulated[]> => {
	try {
		const settings = await SettingModel
			.find(query)
			.populate<{
			created_by: IUser;
			updated_by: IUser;
		}>([
			{
				path: 'created_by',
				select: { password: 0 },
				model: SettingModel,
			},
			{
				path: 'updated_by',
				select: { password: 0 },
				model: SettingModel,
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
		const document = await SettingModel.create(settingToCreate);
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const updateSetting = async (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions): Promise<ISetting | null> => {
	try {
		const document = await SettingModel.findOneAndUpdate({ name: settingToUpdate.name }, {
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