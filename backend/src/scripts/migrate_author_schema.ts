import { connectDatabase, disconnectDatabase } from "../config/db";
import { DocumentRepository } from "../repositories/document.repository";
import { MigrationService } from "../services/migration.service";

const run = async (): Promise<void> => {
  await connectDatabase();

  const migrationService = new MigrationService(new DocumentRepository());
  const migratedCount = await migrationService.migrateAuthorSchema(1000);

  console.log(`Author schema migration complete. Migrated ${migratedCount} documents.`);
  await disconnectDatabase();
};

run().catch(async (error) => {
  console.error("Author schema migration failed", error);
  await disconnectDatabase();
  process.exit(1);
});
