import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Log the URI to the Vercel logs for debugging
console.log('Attempting to connect with MONGODB_URI:', uri ? 'URI is set' : 'URI is NOT SET');

if (!uri) {
  throw new Error('CRITICAL: MONGODB_URI environment variable is not defined.');
}

let client;
let clientPromise;

try {
  client = new MongoClient(uri);
  clientPromise = client.connect();
  console.log('MongoClient created and connection initiated.');
} catch (e) {
    console.error('CRITICAL: Failed to create MongoClient.', e);
    throw e;
}


export async function connectToDatabase() {
    try {
        const connectedClient = await clientPromise;
        const db = connectedClient.db();
        return { client: connectedClient, db };
    } catch (e) {
        console.error('CRITICAL: Failed to establish database connection in connectToDatabase.', e);
        throw e;
    }
}
