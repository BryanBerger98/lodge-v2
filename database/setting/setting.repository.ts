import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions, newId } from '@/lib/database';
import { ISetting, ISettingPopulated, IUnregisteredSettingPopulated } from '@/types/setting.type';
import { IUser } from '@/types/user.type';
import { SettingName, SettingNameType, findDefaultSettingByName } from '@/utils/settings';

import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModels from './setting.model';

export const findSettingByName = async <T extends SettingName = SettingName>(name: T): Promise<ISettingPopulated<SettingNameType<T>> | IUnregisteredSettingPopulated<SettingNameType<T>> | null> => {
	try {
		const document = await SettingModels.default
			.findOne({ name })
			.populate([
				{
					path: 'created_by',
					select: { password: 0 },
				},
				{
					path: 'updated_by',
					select: { password: 0 },
				},
				{ path: 'value' },
			]);
		if (!document) return findDefaultSettingByName(name) || null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findSettings = async (query: FilterQuery<ISetting>): Promise<ISettingPopulated[]> => {
	try {
		// const settings = await SettingModels.default
		// 	.find(query)
		// 	.populate<{
		// 		created_by: IUser;
		// 		updated_by: IUser;
		// 	}>([
		// 		{
		// 			path: 'created_by',
		// 			select: { password: 0 },
		// 		},
		// 		{
		// 			path: 'updated_by',
		// 			select: { password: 0 },
		// 		},
		// 		{ path: 'value' },
		// 	])
		// 	.lean({ virtuals: [ 'id' ] });
		const settings = await SettingModels.default
			.aggregate([
				{
				  $lookup: {
						from: 'files',
						localField: 'value',
						foreignField: '_id',
						as: 'populated_value',
				  },
				},
				{
				  $unwind: {
						path: '$populated_value',
						preserveNullAndEmptyArrays: true,
				  },
				},
				{
				  $project: {
						document: '$$ROOT',
						value: { $ifNull: [ '$populated_value', '$value' ] },
				  },
				},
				{
				  $replaceRoot:
					{
					  newRoot: {
							$mergeObjects: [
						  '$document',
						  { value: '$value' },
							],
					  },
					},
				},
				{
				  $project:
					{ populated_value: 0 },
				},
			]);
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

export const updateSetting = async (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions): Promise<ISettingPopulated | null> => {
	try {
		const document = await SettingModels.default.findOneAndUpdate({ name: settingToUpdate.name }, {
			$set: {
				...settingToUpdate,
				value: [ 'object_id', 'image' ].includes(settingToUpdate.data_type) && settingToUpdate.value ? newId(settingToUpdate.value) : settingToUpdate.value,
				updated_by: settingToUpdate.updated_by ? newId(settingToUpdate.updated_by) : settingToUpdate.updated_by, 
			}, 
		}, {
			new: options?.newDocument || false,
			upsert: options?.upsert || false, 
		});
		if (!document) return null;
		const populatedDocument = await document
			.populate([
				{
					path: 'created_by',
					select: { password: 0 },
				},
				{
					path: 'updated_by',
					select: { password: 0 },
				},
				{
					path: 'value',
					model: SettingModels[ settingToUpdate.data_type ], 
				},
			]);
		return populatedDocument.toObject();
	} catch (error) {
		throw error;
	}
};