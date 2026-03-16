import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";
const client = new MongoClient(uri);

async function checkSettings() {
  try {
    await client.connect();
    const db = client.db();
    
    const settings = await db.collection('sitesettings').findOne({ page_key: 'global' });
    if (settings) {
       console.log("Found Global Settings!");
       console.log("Background Image:", settings.background_image ? "PRESENT (Length: " + settings.background_image.length + ")" : "MISSING");
       if (settings.background_image) {
         console.log("Value starts with:", settings.background_image.substring(0, 50));
       }
    } else {
       console.log("Global settings NOT FOUND");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

checkSettings();
