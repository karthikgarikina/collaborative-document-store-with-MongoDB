import { NextFunction, Request, Response } from "express";
import { DocumentService } from "../services/document.service";

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const document = await this.documentService.createDocument(req.body);
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  };

  listDocuments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const documents = await this.documentService.listRecentDocuments();
      res.status(200).json(documents);
    } catch (error) {
      next(error);
    }
  };

  getDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const document = await this.documentService.getDocumentBySlug(String(req.params.slug));
      res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  };

  updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.documentService.updateDocument(String(req.params.slug), req.body);

      if (result.status === "conflict") {
        res.status(409).json(result.document);
        return;
      }

      res.status(200).json(result.document);
    } catch (error) {
      next(error);
    }
  };

  deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.documentService.deleteDocument(String(req.params.slug));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
