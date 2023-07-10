import { FilterQuery } from 'mongoose';

import { Id, newId } from '@/config/database.config';
import { IUser, IUserWithPassword } from '@/types/user.type';
import { Optional } from '@/types/utils.type';

import { CreateUserDTO, SignupUserDTO, UpdateUserDTO } from './user.dto';
import UserModel from './user.model';

export type SortParams = Record<string, -1 | 1>;

export type QueryOptions = {
	sort?: SortParams,
	skip?: number,
	limit?: number,
};

export const findUsers = async (searchRequest: FilterQuery<IUser>, options?: QueryOptions): Promise<IUser[]> => {
	try {
		const users = await UserModel.find(searchRequest, { password: 0 })
			.skip(options?.skip || 0)
			.limit(options?.limit || 1000)
			.sort(options?.sort || {})
			.lean({ virtuals: true });
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

export const findUserById = async (userId: string | Id): Promise<IUser | null> => {
	try {
		const user = await UserModel.findById(userId, { password: 0 });
		return user?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const findUserWithPasswordById = async (userId: string | Id): Promise<IUserWithPassword | null> => {
	try {
		const user = await UserModel.findById(userId);
		return user?.toObject() || null;
	} catch (error) {
		throw error;
	}
};

export const createUser = async (userToCreate: CreateUserDTO | SignupUserDTO): Promise<IUser | null> => {
	try {
		const createdUserDoc = await UserModel.create({ ...userToCreate });
		const createdUser: Optional<IUserWithPassword, 'password'> = createdUserDoc.toObject();
		delete createdUser.password;
		return createdUser;
	} catch (error) {
		throw error;
	}
};

type UpdateUserOptions = {
	newDocument?: boolean;
}

export const updateUser = async (userToUpdate: UpdateUserDTO, options?: UpdateUserOptions): Promise<IUser | null> => {
	try {
		const updatedUserDoc = await UserModel.findByIdAndUpdate(userToUpdate.id, { $set: { ...userToUpdate } }, { new: options?.newDocument || false });
		const updatedUser: Optional<IUserWithPassword, 'password'> | null = updatedUserDoc?.toObject() || null;
		if (updatedUser) {
			delete updatedUser.password;
		}
		return updatedUser;
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async (userId: string | Id, newHashedPassword: string, updated_by: Id | string): Promise<void> => {
	try {
		await UserModel.findByIdAndUpdate(userId, {
			$set: {
				password: newHashedPassword,
				updated_on: new Date(),
				updated_by,
			},
		});
	} catch (error) {
		throw error;
	}
};

export const deleteUserById = async (userId: string | Id): Promise<IUser | null> => {
	try {
		const deletedUserDoc = await UserModel.findByIdAndDelete(newId(userId));
		const deletedUser: Optional<IUserWithPassword, 'password'> | null = deletedUserDoc?.toObject() || null;
		if (deletedUser) {
			delete deletedUser.password;
		}
		return deletedUser;
	} catch (error) {
		throw error;
	}
};