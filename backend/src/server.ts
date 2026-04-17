import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { DocumentRepository } from "./repositories/document.repository";
import { SeedService } from "./services/seed.service";

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const seedService = new SeedService(new DocumentRepository());
  await seedService.seedIfEmpty();

  app.listen(env.PORT, () => {
    console.log(`Backend API listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
