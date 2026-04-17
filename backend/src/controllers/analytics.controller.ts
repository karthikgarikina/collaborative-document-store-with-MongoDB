import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getMostEdited = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.analyticsService.getMostEditedDocuments());
    } catch (error) {
      next(error);
    }
  };

  getTagCooccurrence = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.analyticsService.getTagCooccurrence());
    } catch (error) {
      next(error);
    }
  };
}
