import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { createUser } from '@/database/user/user.repository';
import { connectToDatabase } from '@/lib/database';
import clientPromise from '@/lib/mongodb';

const DatabaseAdapter = MongoDBAdapter(clientPromise);

DatabaseAdapter.createUser = async (user) => {
	await connectToDatabase();
	const createdUser = await createUser(user);
	return {
		...createdUser,
		id: createdUser.id.toString(), 
	};
};

export default DatabaseAdapter;