import { NextFunction, Request, Response } from "express";
import { SearchService } from "../services/search.service";

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = String(req.query.q ?? "").trim();
      const tags = String(req.query.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const results = await this.searchService.search(query, tags);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}
