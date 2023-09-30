import { FilterQuery } from 'mongoose';

import { newId, UpdateQueryOptions, QueryOptions } from '@/lib/database';
import { IUser, IUserPopulated, IUserWithPassword, UserRole } from '@/types/user.type';
import { Optional } from '@/types/utils';

import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import UserModel from './user.model';

export interface IUserDocument extends IUser, Document {}

export const findUsers = async (searchRequest: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUserPopulated[]> => {
	try {
		const users = await UserModel.find(searchRequest, { password: 0 })
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
			.skip(options?.skip || 0)
			.limit(options?.limit || 1000)
			.sort(options?.sort || {})
			.lean({ virtuals: [ 'id', 'created_by.id', 'updated_by.id' ] });
		return users;
	} catch (error) {
		throw error;
	}
};

export const findUsersCount = async (searchRequest: FilterQuery<IUser>): Promise<number> => {
	try {
		const count = await UserModel.find(searchRequest, { password: 0 }).count();
		return count;
	} catch (error) {
		throw error;
	}
};

export const findOwnerUser = async (): Promise<IUser | null> => {
	try {
		const ownerUser = await UserModel.findOne({ role: 'owner' }, { password: 0 });
		return ownerUser?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const userDoc = await UserModel.findOne({ email: serializedEmail }, { password: 0 });
		const user: Optional<IUserWithPassword, 'password'> | null = userDoc?.toObject() || null;
		if (user) {
			delete user.password;
		}
		return user;
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordByEmail = async (email: string): Promise<IUserWithPassword | null> => {
	try {
		const serializedEmail = email.toLowerCase().trim();
		const user = await UserModel.findOne({ email: serializedEmail });
		return user?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserById = async (user_id: string): Promise<IUser | null> => {
	try {
		const document = await UserModel.findById(newId(user_id), { password: 0 });
		if (!document) return null;
		return document.toObject();
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordById = async (user_id: string): Promise<IUserWithPassword | null> => {
	try {
		const user = await UserModel.findById(newId(user_id));
		return user?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

interface ICreatedUser extends IUser {
	role: UserRole;
}

export const createUser = async (userToCreate: CreateUserDTO): Promise<ICreatedUser> => {
	try {
		const createdUserDoc = await UserModel.create({ ...userToCreate });
		const createdUser: Optional<IUserWithPassword, 'password'> = createdUserDoc.toObject();
		delete createdUser.password;
		return createdUser as ICreatedUser;
	} catch (error) {
		throw error;
	}
};

export const updateUser = async (userToUpdate: UpdateUserDTO, options?: UpdateQueryOptions): Promise<IUser | null> => {
	try {
		const updatedUserDoc = await UserModel.findByIdAndUpdate(newId(userToUpdate.id), { $set: { ...userToUpdate } }, { new: options?.newDocument || false });
		const updatedUser: Optional<IUserWithPassword, 'password'> | null = updatedUserDoc?.toObject() || null;
		if (updatedUser) {
			delete updatedUser.password;
		}
		return updatedUser;
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

export const deleteUserById = async (user_id: string): Promise<IUser | null> => {
	try {
		const deletedUserDoc = await UserModel.findByIdAndDelete(newId(user_id));
		const deletedUser: Optional<IUserWithPassword, 'password'> | null = deletedUserDoc?.toObject() || null;
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