import { Router } from "express";
import { SearchController } from "../controllers/search.controller";
import { AppError } from "../utils/app-error";

export const createSearchRouter = (searchController: SearchController): Router => {
  const router = Router();

  router.get(
    "/",
    (req, _res, next) => {
      const query = String(req.query.q ?? "").trim();
      if (!query) {
        next(new AppError("Query parameter q is required", 400));
        return;
      }

      next();
    },
    searchController.search
  );

  return router;
};
