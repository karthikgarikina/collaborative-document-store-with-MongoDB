import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { AnalyticsController } from "./controllers/analytics.controller";
import { DocumentController } from "./controllers/document.controller";
import { SearchController } from "./controllers/search.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { DocumentRepository } from "./repositories/document.repository";
import { createApiRouter } from "./routes";
import { AnalyticsService } from "./services/analytics.service";
import { DocumentService } from "./services/document.service";
import { SearchService } from "./services/search.service";

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const searchService = new SearchService(documentRepository);
const analyticsService = new AnalyticsService(documentRepository);

const documentController = new DocumentController(documentService);
const searchController = new SearchController(searchService);
const analyticsController = new AnalyticsController(analyticsService);

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(loggerMiddleware);

app.use("/api", createApiRouter(documentController, searchController, analyticsController));
app.use(notFoundMiddleware);
app.use(errorMiddleware);
