import { Router } from "express";
import { z } from "zod";
import { DocumentController } from "../controllers/document.controller";
import { validate } from "../middleware/validation.middleware";

const createDocumentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  authorName: z.string().min(1),
  authorEmail: z.string().email()
});

const updateDocumentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  version: z.number().int().min(1),
  authorId: z.string().optional()
});

export const createDocumentRouter = (documentController: DocumentController): Router => {
  const router = Router();

  router.get("/", documentController.listDocuments);
  router.post("/", validate(createDocumentSchema), documentController.createDocument);
  router.get("/:slug", documentController.getDocument);
  router.put("/:slug", validate(updateDocumentSchema), documentController.updateDocument);
  router.delete("/:slug", documentController.deleteDocument);

  return router;
};
