import mongoose from 'mongoose';

type MongooseConnection = {
	promise: Promise<typeof mongoose> | typeof mongoose | null;
	conn: Promise<typeof mongoose> | typeof mongoose | null;
};

declare global {
    /*~ Here, declare things that go in the global namespace, or augment
     *~ existing declarations in the global namespace
     */
	namespace globalThis {
		// eslint-disable-next-line no-var
		var mongoose: MongooseConnection;
	}
}