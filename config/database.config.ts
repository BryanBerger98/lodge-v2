import mongoose, { Types } from 'mongoose';

export type Id = Types.ObjectId;
export const newId = (idString?: string | Id) => new Types.ObjectId(idString);

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME, DB_PORT } = process.env;

const getMongoDBURI = () => {
	if (!DB_CLUSTER && !DB_USER && !DB_PASSWORD) {
		if (!DB_NAME) {
			throw new Error('Please define the DB_NAME environment variable inside .env.local');
		}
		return `mongodb://localhost:${ DB_PORT || '27017' }/${ DB_NAME }?retryWrites=true&w=majority`;
	}
	console.info('Connecting to MongoDB server...');
	return `mongodb+srv://${ DB_USER }:${ DB_PASSWORD }@${ DB_CLUSTER }.mongodb.net/${ DB_NAME }?retryWrites=true&w=majority`;
};

const MONGODB_URI = getMongoDBURI();

if (!MONGODB_URI) {
	throw new Error(
		'Wrong MONGODB_URI. Please define the environment variables inside .env.local'
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = {
		conn: null,
		promise: null,
	};
	global.mongoose = {
		conn: null,
		promise: null,
	};
}

export const connectToDatabase = async () => {
	try {
		if (cached.conn) {
			return cached.conn;
		}

		if (!cached.promise) {
			const opts = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				bufferCommands: false,
				maxPoolSize: 10,
			};

			cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
				console.info('MongoDB connected successfully.');
				return mongoose;
			});
		}
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		console.error('MONGODB CONNECTION ERROR >>>', error);
		throw error;
	}
};