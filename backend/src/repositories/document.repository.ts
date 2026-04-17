import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { DocumentModel } from "../models/document.model";
import { DocumentEntity } from "../types/document";

export type PersistedDocument = DocumentEntity & { _id: Types.ObjectId };
type DocumentMutation = Partial<DocumentEntity>;

export class DocumentRepository {
  async countDocuments(): Promise<number> {
    return DocumentModel.countDocuments();
  }

  async syncIndexes(): Promise<void> {
    await DocumentModel.syncIndexes();
  }

  async insertMany(documents: DocumentMutation[]): Promise<void> {
    await DocumentModel.insertMany(documents, { ordered: false });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const existing = await DocumentModel.exists({ slug });
    return Boolean(existing);
  }

  async create(document: DocumentMutation): Promise<PersistedDocument> {
    const created = await DocumentModel.create(document);
    return created.toObject() as PersistedDocument;
  }

  async findBySlug(slug: string): Promise<PersistedDocument | null> {
    return DocumentModel.findOne({ slug }).lean();
  }

  async listRecent(limit: number): Promise<PersistedDocument[]> {
    return DocumentModel.find().sort({ "metadata.updatedAt": -1 }).limit(limit).lean();
  }

  async deleteBySlug(slug: string): Promise<boolean> {
    const result = await DocumentModel.deleteOne({ slug });
    return result.deletedCount > 0;
  }

  async findOneAndUpdate(
    filter: FilterQuery<PersistedDocument>,
    update: UpdateQuery<PersistedDocument>
  ): Promise<PersistedDocument | null> {
    return DocumentModel.findOneAndUpdate(filter, update, {
      new: true
    }).lean();
  }

  async searchText(query: Record<string, unknown>, limit: number): Promise<Array<Record<string, unknown>>> {
    return DocumentModel.find(query, {
      slug: 1,
      title: 1,
      content: 1,
      version: 1,
      tags: 1,
      metadata: 1,
      revision_history: 1,
      score: { $meta: "textScore" }
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();
  }

  async aggregate<T>(pipeline: PipelineStage[]): Promise<T[]> {
    return DocumentModel.aggregate<T>(pipeline);
  }

  async bulkWrite(operations: Parameters<typeof DocumentModel.bulkWrite>[0]): Promise<void> {
    await DocumentModel.bulkWrite(operations);
  }

  async findOldAuthorSchemaBatch(limit: number): Promise<PersistedDocument[]> {
    return DocumentModel.find({ "metadata.author": { $type: "string" } })
      .sort({ _id: 1 })
      .limit(limit)
      .lean();
  }
}
