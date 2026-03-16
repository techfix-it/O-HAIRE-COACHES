import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 10000,
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Conexão com MongoDB Atlas bem-sucedida!");

    // Listar bancos de dados
    const dbs = await client.db().admin().listDatabases();
    console.log("Bancos disponíveis:", dbs.databases.map(d => d.name));

    // Verificar collections na DB principal
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Contar eventos
    if (collections.some(c => c.name === 'events')) {
      const count = await db.collection('events').countDocuments();
      console.log(`Total de eventos: ${count}`);
      if (count > 0) {
        const sample = await db.collection('events').findOne();
        console.log("Exemplo de evento:", JSON.stringify(sample, null, 2));
      }
    }
  } catch (err) {
    console.error("❌ Erro de conexão:", err.message);
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error("→ Problema de DNS/rede. Verifique a ligação à internet.");
    } else if (err.message.includes('authentication')) {
      console.error("→ Credenciais inválidas.");
    } else if (err.message.includes('IP')) {
      console.error("→ IP não está na whitelist do Atlas. Adicione o IP em Network Access.");
    } else if (err.message.includes('timed out') || err.message.includes('ETIMEDOUT')) {
      console.error("→ Timeout. O IP desta máquina pode não estar na whitelist do Atlas.");
    }
  } finally {
    await client.close();
  }
}

run();
