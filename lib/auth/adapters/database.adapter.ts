import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { createUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import clientPromise from '@/lib/mongodb';
import { Role } from '@/schemas/role.schema';

const DatabaseAdapter = MongoDBAdapter(clientPromise);

DatabaseAdapter.createUser = async (user) => {
	await connectToDatabase();
	const createdUser = await createUser({
		...user,
		has_password: false,
		created_by: null,
		photo: user.photo?.id || null,
	});
	return {
		...createdUser,
		role: createdUser.role === Role.OWNER ? Role.USER : createdUser.role,
	};
};

export default DatabaseAdapter;