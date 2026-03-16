import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";
const client = new MongoClient(uri);

async function inspect() {
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    for (const dbInfo of dbs.databases) {
      console.log(`--- Database: ${dbInfo.name} ---`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`Collection: ${col.name} - Count: ${count}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

inspect();
