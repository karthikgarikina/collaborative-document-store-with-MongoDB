export interface AuthorInfo {
  id: string | null;
  name: string;
  email: string | null;
}

export interface RevisionHistoryEntry {
  version: number;
  updatedAt: Date;
  authorId: string;
  contentDiff: string;
}

export interface DocumentMetadata {
  author: AuthorInfo | string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
}

export interface DocumentEntity {
  slug: string;
  title: string;
  content: string;
  version: number;
  tags: string[];
  metadata: DocumentMetadata;
  revision_history: RevisionHistoryEntry[];
}

export interface SearchResult extends Omit<DocumentEntity, "metadata"> {
  metadata: Omit<DocumentMetadata, "author"> & { author: AuthorInfo };
  score: number;
}

export interface MostEditedResult {
  slug: string;
  title: string;
  editCount: number;
  version: number;
  updatedAt: Date;
}

export interface TagCooccurrenceResult {
  tags: [string, string];
  count: number;
}
