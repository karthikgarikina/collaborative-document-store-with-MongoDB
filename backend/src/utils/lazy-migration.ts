import { AuthorInfo } from "../types/document";

export const normalizeAuthor = (author: AuthorInfo | string): AuthorInfo => {
  if (typeof author === "string") {
    return {
      id: null,
      name: author,
      email: null
    };
  }

  return {
    id: author.id ?? null,
    name: author.name,
    email: author.email ?? null
  };
};

export const applyLazyAuthorMigration = <T extends { metadata: { author: AuthorInfo | string } }>(
  document: T
): T & { metadata: { author: AuthorInfo } } => ({
  ...document,
  metadata: {
    ...document.metadata,
    author: normalizeAuthor(document.metadata.author)
  }
});
