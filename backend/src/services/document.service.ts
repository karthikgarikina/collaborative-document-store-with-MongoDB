import { DocumentRepository } from "../repositories/document.repository";
import { AuthorInfo, DocumentEntity } from "../types/document";
import { AppError } from "../utils/app-error";
import { buildContentDiffSummary } from "../utils/content-diff";
import { applyLazyAuthorMigration, normalizeAuthor } from "../utils/lazy-migration";
import { buildUniqueSlug } from "../utils/slug";
import { getWordCount } from "../utils/word-count";

export interface CreateDocumentInput {
  title: string;
  content: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
}

export interface UpdateDocumentInput {
  title: string;
  content: string;
  tags?: string[];
  version: number;
  authorId?: string;
}

export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async createDocument(input: CreateDocumentInput): Promise<DocumentEntity> {
    const slug = await buildUniqueSlug(input.title, (candidate) =>
      this.documentRepository.existsBySlug(candidate)
    );
    const now = new Date();
    const author: AuthorInfo = {
      id: null,
      name: input.authorName,
      email: input.authorEmail
    };

    const created = await this.documentRepository.create({
      slug,
      title: input.title,
      content: input.content,
      version: 1,
      tags: input.tags,
      metadata: {
        author,
        createdAt: now,
        updatedAt: now,
        wordCount: getWordCount(input.content)
      },
      revision_history: []
    });

    return applyLazyAuthorMigration(created);
  }

  async getDocumentBySlug(slug: string): Promise<DocumentEntity> {
    const document = await this.documentRepository.findBySlug(slug);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    return applyLazyAuthorMigration(document);
  }

  async listRecentDocuments(limit = 25): Promise<DocumentEntity[]> {
    const documents = await this.documentRepository.listRecent(limit);
    return documents.map((document) => applyLazyAuthorMigration(document));
  }

  async deleteDocument(slug: string): Promise<void> {
    const deleted = await this.documentRepository.deleteBySlug(slug);
    if (!deleted) {
      throw new AppError("Document not found", 404);
    }
  }

  async updateDocument(
    slug: string,
    input: UpdateDocumentInput
  ): Promise<{ status: "updated" | "conflict"; document: DocumentEntity }> {
    const currentDocument = await this.documentRepository.findBySlug(slug);
    if (!currentDocument) {
      throw new AppError("Document not found", 404);
    }

    const author = normalizeAuthor(currentDocument.metadata.author);
    const now = new Date();
    const newVersion = input.version + 1;

    const updatedDocument = await this.documentRepository.findOneAndUpdate(
      { slug, version: input.version },
      {
        $set: {
          title: input.title,
          content: input.content,
          tags: input.tags ?? currentDocument.tags,
          "metadata.updatedAt": now,
          "metadata.wordCount": getWordCount(input.content),
          "metadata.author": author
        },
        $inc: { version: 1 },
        $push: {
          revision_history: {
            $each: [
              {
                version: newVersion,
                updatedAt: now,
                authorId: input.authorId ?? author.id ?? "unknown",
                contentDiff: buildContentDiffSummary(
                  currentDocument.title,
                  input.title,
                  currentDocument.content,
                  input.content
                )
              }
            ],
            $slice: -20
          }
        }
      }
    );

    if (!updatedDocument) {
      return {
        status: "conflict",
        document: await this.getDocumentBySlug(slug)
      };
    }

    return {
      status: "updated",
      document: applyLazyAuthorMigration(updatedDocument)
    };
  }
}
