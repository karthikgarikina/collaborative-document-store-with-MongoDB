import { DocumentRepository } from "../repositories/document.repository";
import { normalizeAuthor } from "../utils/lazy-migration";

export class MigrationService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async migrateAuthorSchema(batchSize = 1000): Promise<number> {
    let migratedCount = 0;

    while (true) {
      const batch = await this.documentRepository.findOldAuthorSchemaBatch(batchSize);
      if (batch.length === 0) {
        break;
      }

      const operations = batch.map((document) => ({
        updateOne: {
          filter: { _id: document._id },
          update: {
            $set: {
              "metadata.author": normalizeAuthor(document.metadata.author)
            }
          }
        }
      }));

      await this.documentRepository.bulkWrite(operations);
      migratedCount += batch.length;
      console.log(`Migrated ${migratedCount} documents so far...`);
    }

    return migratedCount;
  }
}
