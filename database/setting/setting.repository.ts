import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions, newId } from '@/lib/database';
import { ISetting, ISettingPopulated, IUnregisteredSettingPopulated } from '@/types/setting.type';
import { SettingName, SettingNameType, findDefaultSettingByName } from '@/utils/settings';

import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModels from './setting.model';

export const findSettingByName = async <T extends SettingName = SettingName>(name: T): Promise<ISettingPopulated<SettingNameType<T>> | IUnregisteredSettingPopulated<SettingNameType<T>> | null> => {
	try {
		const [ document ] = await SettingModels.default
			.aggregate([
				{ $match: { name } },
				{
					$lookup: {
					  from: 'users',
					  localField: 'created_by',
					  foreignField: '_id',
					  as: 'created_by',
					},
				  },
				  {
					$unwind: {
					  path: '$created_by',
					  preserveNullAndEmptyArrays: true,
					},
				  },
				  {
					$lookup: {
					  from: 'users',
					  localField: 'updated_by',
					  foreignField: '_id',
					  as: 'updated_by',
					},
				  },
				  {
					$unwind: {
					  path: '$updated_by',
					  preserveNullAndEmptyArrays: true,
					},
				  },
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
					$addFields: {
					  id: { $toString: '$_id' },
					  populated_value: {
							$cond: [
						  { $ifNull: [ '$populated_value', false ] },
						  {
									$mergeObjects: [
							  '$populated_value',
							  {
											id: {
								  $toString:
									'$populated_value._id',
											},
											created_by: {
								  $toString:
									'$populated_value.created_by',
											},
							  },
									],
						  },
						  null,
							],
					  },
					},
				  },
				  {
					$project: {
					  document: '$$ROOT',
					  value: { $ifNull: [ '$populated_value', '$value' ] },
					},
				  },
				  {
					$replaceRoot: {
					  newRoot: {
							$mergeObjects: [
						  '$document',
						  { value: '$value' },
							],
					  },
					},
				  },
				  {
					$addFields: {
					  created_by: {
							$cond: [
								{ $ifNull: [ '$created_by', false ] },
								{
									$mergeObjects: [
										'$created_by',
										{ id: { $toString: '$created_by._id' } },
									],
								},
								null,
							],
						},
					  updated_by: {
							$cond: [
								{ $ifNull: [ '$updated_by', false ] },
								{
									$mergeObjects: [
										'$updated_by',
										{ id: { $toString: '$updated_by._id' } },
									],
								},
								null,
							],
					  },
					},
				  },
				  {
					$project: {
						populated_value: 0,
						_id: 0,
						'value._id': 0,
						'updated_by._id': 0,
				   }, 
				},
			]);
		if (!document) return findDefaultSettingByName(name) || null;
		return document;
	} catch (error) {
		throw error;
	}
};

export const findSettings = async (query: FilterQuery<ISetting>): Promise<ISettingPopulated[]> => {
	try {
		const settings = await SettingModels.default
			.aggregate([
				{ $match: query },
				{
					$lookup: {
					  from: 'users',
					  localField: 'created_by',
					  foreignField: '_id',
					  as: 'created_by',
					},
				  },
				  {
					$unwind: {
					  path: '$created_by',
					  preserveNullAndEmptyArrays: true,
					},
				  },
				  {
					$lookup: {
					  from: 'users',
					  localField: 'updated_by',
					  foreignField: '_id',
					  as: 'updated_by',
					},
				  },
				  {
					$unwind: {
					  path: '$updated_by',
					  preserveNullAndEmptyArrays: true,
					},
				  },
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
					$addFields: {
					  id: { $toString: '$_id' },
					  populated_value: {
							$cond: [
						  { $ifNull: [ '$populated_value', false ] },
						  {
									$mergeObjects: [
							  '$populated_value',
							  {
											id: {
								  $toString:
									'$populated_value._id',
											},
											created_by: {
								  $toString:
									'$populated_value.created_by',
											},
							  },
									],
						  },
						  null,
							],
					  },
					},
				  },
				  {
					$project: {
					  document: '$$ROOT',
					  value: { $ifNull: [ '$populated_value', '$value' ] },
					},
				  },
				  {
					$replaceRoot: {
					  newRoot: {
							$mergeObjects: [
						  '$document',
						  { value: '$value' },
							],
					  },
					},
				  },
				  {
					$addFields: {
					  created_by: {
							$cond: [
								{ $ifNull: [ '$created_by', false ] },
								{
									$mergeObjects: [
										'$created_by',
										{ id: { $toString: '$created_by._id' } },
									],
								},
								null,
							],
						},
					  updated_by: {
							$cond: [
								{ $ifNull: [ '$updated_by', false ] },
								{
									$mergeObjects: [
										'$updated_by',
										{ id: { $toString: '$updated_by._id' } },
									],
								},
								null,
							],
					  },
					},
				  },
				  {
					$project: {
						populated_value: 0,
						_id: 0,
						'value._id': 0,
						'updated_by._id': 0,
				   }, 
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