const path = require("node:path");

const backendNodeModulesPath = path.join(__dirname, "..", "backend", "node_modules");
const dotenv = require(path.join(backendNodeModulesPath, "dotenv"));
const mongoose = require(path.join(backendNodeModulesPath, "mongoose"));

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "backend", ".env") });

const rawMongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const mongoUri =
  rawMongoUri.includes("://mongo:") ? rawMongoUri.replace("://mongo", "://localhost") : rawMongoUri;
const databaseName = process.env.DATABASE_NAME || "collab_docs";
const batchSize = Number(process.env.MIGRATION_BATCH_SIZE || 1000);

const normalizeAuthor = (author) => ({
  id: null,
  name: String(author),
  email: null
});

const run = async () => {
  await mongoose.connect(mongoUri, { dbName: databaseName });

  const documentsCollection = mongoose.connection.collection("documents");
  let migratedCount = 0;

  while (true) {
    const batch = await documentsCollection
      .find({ "metadata.author": { $type: "string" } })
      .sort({ _id: 1 })
      .limit(batchSize)
      .toArray();

    if (batch.length === 0) {
      break;
    }

    await documentsCollection.bulkWrite(
      batch.map((document) => ({
        updateOne: {
          filter: { _id: document._id },
          update: {
            $set: {
              "metadata.author": normalizeAuthor(document.metadata.author)
            }
          }
        }
      }))
    );

    migratedCount += batch.length;
    console.log(`Migrated ${migratedCount} documents so far...`);
  }

  console.log(`Author schema migration complete. Migrated ${migratedCount} documents.`);
};

run()
  .catch((error) => {
    console.error("Author schema migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
