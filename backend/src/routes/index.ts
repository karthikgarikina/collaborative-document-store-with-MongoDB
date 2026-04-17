import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { DocumentController } from "../controllers/document.controller";
import { healthController } from "../controllers/health.controller";
import { SearchController } from "../controllers/search.controller";
import { createAnalyticsRouter } from "./analytics.routes";
import { createDocumentRouter } from "./document.routes";
import { createSearchRouter } from "./search.routes";

export const createApiRouter = (
  documentController: DocumentController,
  searchController: SearchController,
  analyticsController: AnalyticsController
): Router => {
  const router = Router();

  router.get("/health", healthController);
  router.use("/documents", createDocumentRouter(documentController));
  router.use("/search", createSearchRouter(searchController));
  router.use("/analytics", createAnalyticsRouter(analyticsController));

  return router;
};
