import { FilterQuery } from 'mongoose';

import { newId, UpdateQueryOptions, QueryOptions } from '@/lib/database';
import { User, UserPopulated, UserPopulatedWithPassword, UserWithPassword } from '@/schemas/user';
import { Optional } from '@/types/utils';

import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import UserModel from './user.model';
import { populateUser } from './utils/populate-user';

export interface UserDocument extends User, Document {}

export const findUsers = async (searchRequest: FilterQuery<User>, options?: QueryOptions<User>): Promise<UserPopulated[]> => {
	try {
		const users = await UserModel.find(searchRequest, { password: 0 })
			.populate(populateUser)
			.skip(options?.skip || 0)
			.limit(options?.limit || 1000)
			.sort(options?.sort || {});
		return users.map(user => user.toJSON());
	} catch (error) {
		throw error;
	}
};

export const findUsersCount = async (searchRequest: FilterQuery<User>): Promise<number> => {
	try {
		const count = await UserModel.find(searchRequest, { password: 0 }).count();
		return count;
	} catch (error) {
		throw error;
	}
};

export const findOwnerUser = async (): Promise<User | null> => {
	try {
		const ownerUser = await UserModel.findOne({ role: 'owner' }, { password: 0 });
		return ownerUser?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const document = await UserModel.findOne({ email: serializedEmail }, { password: 0 });
		return document?.toJSON() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordByEmail = async (email: string): Promise<UserPopulatedWithPassword | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const document = await UserModel.findOne({ email: serializedEmail }).populate(populateUser);
		return document?.toJSON() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserById = async (user_id: string): Promise<UserPopulated | null> => {
	try {
		const document = await UserModel
			.findById(newId(user_id), { password: 0 })
			.populate(populateUser);
		if (!document) return null;
		return document.toJSON();
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordById = async (user_id: string): Promise<UserWithPassword | null> => {
	try {
		const user = await UserModel.findById(newId(user_id));
		return user?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const createUser = async (userData: CreateUserDTO): Promise<UserPopulated> => {
	try {
		const createdDocument = await UserModel.create({ ...userData });
		const document = await createdDocument.populate(populateUser);
		return document.toJSON();
	} catch (error) {
		throw error;
	}
};

export const updateUser = async (userToUpdate: UpdateUserDTO, options?: UpdateQueryOptions): Promise<UserPopulated | null> => {
	try {
		await UserModel.findByIdAndUpdate(newId(userToUpdate.id), {
			$set: {
				...userToUpdate,
				photo: userToUpdate.photo ? newId(userToUpdate.photo) : undefined, 
			}, 
		}, { new: options?.newDocument || false });
		const document = await UserModel.findById(newId(userToUpdate.id), { password: 0 }).populate(populateUser);
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async (user_id: string, newHashedPassword: string, updated_by: string): Promise<void> => {
	try {
		await UserModel.findByIdAndUpdate(newId(user_id), {
			$set: {
				password: newHashedPassword,
				has_password: true,
				updated_on: new Date(),
				updated_by: newId(updated_by),
			},
		});
	} catch (error) {
		throw error;
	}
};

export const deleteUserById = async (user_id: string): Promise<User | null> => {
	try {
		const deletedUserDoc = await UserModel.findByIdAndDelete(newId(user_id));
		const deletedUser: Optional<UserWithPassword, 'password'> | null = deletedUserDoc?.toObject() || null;
		if (deletedUser) {
			delete deletedUser.password;
		}
		return deletedUser;
	} catch (error) {
		throw error;
	}
};

export const deleteMultipleUsersById = async (user_ids: string[]): Promise<number> => {
	try {
		const { deletedCount } = await UserModel.deleteMany({ _id: { $in: user_ids.map(id => newId(id)) } });
		return deletedCount;
	} catch (error) {
		throw error;
	}
};