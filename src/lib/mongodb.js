import { MongoClient, ServerApiVersion } from "mongodb";

let client;

function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return client;
}

export async function connect(collection) {
  const c = getClient();
  await c.connect();
  // DB_NAME env var থেকে নাও, না থাকলে URI থেকে নাও
  const dbName = process.env.DB_NAME || "mkTravelAgency";
  return c.db(dbName).collection(collection);
}
