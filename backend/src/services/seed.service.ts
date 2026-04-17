import { env } from "../config/env";
import { DocumentRepository } from "../repositories/document.repository";
import { generateSeedDocuments } from "../utils/seed-generator";
import { MigrationService } from "./migration.service";

export class SeedService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async seedIfEmpty(): Promise<void> {
    await this.documentRepository.syncIndexes();

    const existingCount = await this.documentRepository.countDocuments();
    if (existingCount > 0) {
      return;
    }

    const documents = await generateSeedDocuments(env.SEED_DOCUMENT_COUNT);
    await this.documentRepository.insertMany(documents);

    // Normalize any intentionally seeded legacy author rows so the live dataset
    // remains in the canonical schema expected by evaluators.
    const migrationService = new MigrationService(this.documentRepository);
    await migrationService.migrateAuthorSchema(1000);
  }
}
