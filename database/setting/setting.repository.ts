import { FilterQuery } from 'mongoose';

import { UpdateQueryOptions, newId } from '@/lib/database';
import { Setting, SettingPopulated, SettingName, SettingDataType } from '@/schemas/setting';
import { UnregisteredSettingPopulated } from '@/schemas/setting/unregistered-setting.schema';
import { SettingNameType, findDefaultSettingByName } from '@/utils/settings';

import { populateSetting } from './populate-setting';
import { CreateSettingDTO, UpdateSettingDTO } from './setting.dto';
import SettingModels, { getSettingModel } from './setting.model';

export const findSettingByName = async <T extends SettingName>(name: T): Promise<SettingPopulated<SettingNameType<T>> | UnregisteredSettingPopulated<SettingNameType<T>> | null> => {
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

export const findSettings = async (query: FilterQuery<Setting>): Promise<SettingPopulated[]> => {
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

export const createSetting = async (settingToCreate: CreateSettingDTO): Promise<Setting> => {
	try {
		const SettingModel = getSettingModel(settingToCreate.data_type);
		const newSetting = new SettingModel(settingToCreate);
		const document = await newSetting.save();
		return document.toJSON();
	} catch (error) {
		throw error;
	}
};

const updateSettingDocument = (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions) => {
	const updateOperation = {
		$set: {
			value: settingToUpdate.value,
			data_type: settingToUpdate.data_type,
			updated_by: settingToUpdate.updated_by ? newId(settingToUpdate.updated_by) : settingToUpdate.updated_by, 
		}, 
	};
	switch (settingToUpdate.data_type) {
		case SettingDataType.STRING:
			return SettingModels.string.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.ARRAY_OF_OBJECT_IDS:
			return SettingModels.array_of_object_ids.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.ARRAY_OF_STRINGS:
			return SettingModels.array_of_strings.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.BOOLEAN:
			return SettingModels.boolean.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.DATE:
			return SettingModels.date.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.IMAGE:
			return SettingModels.image.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.NUMBER:
			return SettingModels.number.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		case SettingDataType.OBJECT_ID:
			return SettingModels.object_id.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
		default:
			return SettingModels.default.findOneAndUpdate({ name: settingToUpdate.name }, updateOperation, {
				new: options?.newDocument || false,
				upsert: options?.upsert || false, 
			});
	}
};

export const updateSetting = async (settingToUpdate: UpdateSettingDTO, options?: UpdateQueryOptions): Promise<SettingPopulated | null> => {
	try {
		const document = await updateSettingDocument(settingToUpdate, options);
		if (!document) return null;
		const populatedDocument = await document.populate(populateSetting(settingToUpdate.data_type));
		return populatedDocument.toJSON();
	} catch (error) {
		throw error;
	}
};