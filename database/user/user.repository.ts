import { FilterQuery } from 'mongoose';

import { Id } from '@/config/database.config';
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
		const user = await UserModel.findOne({ email: serializedEmail }, { password: 0 });
		const userObject: Optional<IUserWithPassword, 'password'> | null = user?.toObject() || null;
		if (userObject) {
			delete userObject.password;
		}
		return userObject;
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
		const createdUser: Optional<IUserWithPassword, 'password'> = await UserModel.create({ ...userToCreate });
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
		const updatedUser: Optional<IUserWithPassword, 'password'> | null = await UserModel.findByIdAndUpdate(userToUpdate.id, { $set: { ...userToUpdate } }, { new: options?.newDocument || false });
		if (updatedUser) {
			delete updatedUser.password;
		}
		return updatedUser;
	} catch (error) {
		throw error;
	}
};

export const updateUserPassword = async (userId: string | Id, newHashedPassword: string): Promise<void> => {
	try {
		await UserModel.findByIdAndUpdate(userId, {
			$set: {
				password: newHashedPassword,
				updated_on: new Date(),
			},
		});
	} catch (error) {
		throw error;
	}
};

export const deleteUserById = async (userId: string | Id): Promise<IUser | null> => {
	try {
		const deletedUser = await UserModel.findByIdAndDelete(userId);
		return deletedUser;
	} catch (error) {
		throw error;
	}
};