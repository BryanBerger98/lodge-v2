import { FilterQuery } from 'mongoose';

import { Id, newId, UpdateQueryOptions, QueryOptions } from '@/lib/database';
import { IUser, IUserWithPassword, UserRole } from '@/types/user.type';
import { Optional } from '@/types/utils.type';

import { CreateUserDTO, SignupUserDTO, UpdateUserDTO } from './user.dto';
import UserModel from './user.model';

export const findUsers = async (searchRequest: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUser[]> => {
	try {
		const users = await UserModel.find(searchRequest, { password: 0 })
			.skip(options?.skip || 0)
			.limit(options?.limit || 1000)
			.sort(options?.sort || {})
			.lean({ virtuals: [ 'id' ] });
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

interface ICreatedUser extends IUser {
	role: UserRole;
}

export const createUser = async (userToCreate: CreateUserDTO | SignupUserDTO): Promise<ICreatedUser> => {
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
				has_password: true,
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

export const deleteMultipleUsersById = async (userIds: (string | Id)[]): Promise<number> => {
	try {
		const { deletedCount } = await UserModel.deleteMany({ _id: { $in: userIds.map(id => newId(id)) } });
		return deletedCount;
	} catch (error) {
		throw error;
	}
};