// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb';

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME, DB_PORT } = process.env;

export const getMongoDBURI = () => {
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

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.ENVIRONMENT === 'Development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	if (!global._mongoClientPromise) {
		client = new MongoClient(MONGODB_URI, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(MONGODB_URI, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;