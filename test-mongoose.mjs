import mongoose from 'mongoose';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";

async function testMongoose() {
  try {
    console.log("Tentando conectar com Mongoose...");
    await mongoose.connect(uri);
    console.log("✅ Mongoose conectado com sucesso!");
    
    // Check connection state
    console.log("Estado da conexão:", mongoose.connection.readyState);
    
    // Try a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log("Mongoose desconectado.");
  } catch (err) {
    console.error("❌ Erro no Mongoose:", err);
  }
}

testMongoose();
