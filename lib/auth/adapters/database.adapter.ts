import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { createUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import clientPromise from '@/lib/mongodb';

const DatabaseAdapter = MongoDBAdapter(clientPromise);

DatabaseAdapter.createUser = async (user) => {
	await connectToDatabase();
	const createdUser = await createUser({
		...user,
		created_by: null,
		photo: null,
	});
	return {
		...createdUser,
		role: createdUser.role === 'owner' ? 'user' : createdUser.role,
	};
};

export default DatabaseAdapter;