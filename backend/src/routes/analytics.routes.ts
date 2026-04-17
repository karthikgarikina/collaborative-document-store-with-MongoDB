import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

export const createAnalyticsRouter = (analyticsController: AnalyticsController): Router => {
  const router = Router();

  router.get("/most-edited", analyticsController.getMostEdited);
  router.get("/tag-cooccurrence", analyticsController.getTagCooccurrence);

  return router;
};
