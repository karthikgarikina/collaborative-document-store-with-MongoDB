import { parseStringPromise } from "xml2js";
import { AuthorInfo, DocumentEntity, RevisionHistoryEntry } from "../types/document";
import { normalizeSlug } from "./slug";
import { getWordCount } from "./word-count";

const baseWikiXml = `
<mediawiki>
  <page>
    <title>MongoDB Fundamentals</title>
    <text>MongoDB stores JSON-like documents and supports flexible schemas for modern application development.</text>
  </page>
  <page>
    <title>Optimistic Concurrency Control</title>
    <text>Optimistic concurrency control avoids lost updates by validating a version token during writes.</text>
  </page>
  <page>
    <title>Aggregation Pipelines</title>
    <text>Aggregation pipelines combine stages such as match, project, group, sort, and limit to analyze data.</text>
  </page>
  <page>
    <title>Full Text Search</title>
    <text>Text indexes in MongoDB support relevance-based search over indexed string fields.</text>
  </page>
  <page>
    <title>Schema Evolution</title>
    <text>Schema evolution strategies such as lazy migration and background updates keep systems maintainable.</text>
  </page>
</mediawiki>
`;

const tagPools = [
  ["mongodb", "guide", "backend"],
  ["concurrency", "api-design", "collaboration"],
  ["analytics", "aggregation", "data"],
  ["search", "mongodb", "indexing"],
  ["migration", "maintenance", "schema"]
];

const authorPool: AuthorInfo[] = [
  { id: "user-100", name: "Jane Doe", email: "jane@example.com" },
  { id: "user-101", name: "Alex Smith", email: "alex@example.com" },
  { id: "user-102", name: "Priya Raman", email: "priya@example.com" },
  { id: "user-103", name: "Liam Chen", email: "liam@example.com" },
  { id: "user-104", name: "Maya Singh", email: "maya@example.com" }
];

interface ParsedPage {
  title: string;
  text: string;
}

const parseBasePages = async (): Promise<ParsedPage[]> => {
  const parsed = await parseStringPromise(baseWikiXml);
  const pages = parsed.mediawiki.page as Array<{ title: string[]; text: string[] }>;

  return pages.map((page) => ({
    title: page.title[0],
    text: page.text[0]
  }));
};

const buildRevisionHistory = (version: number, authorId: string, updatedAt: Date): RevisionHistoryEntry[] => {
  const revisionCount = Math.max(0, Math.min(19, (version % 7) + 1));

  return Array.from({ length: revisionCount }, (_, index) => {
    const revisionVersion = Math.max(1, version - revisionCount + index);

    return {
      version: revisionVersion,
      updatedAt: new Date(updatedAt.getTime() - (revisionCount - index) * 86400000),
      authorId,
      contentDiff: `revision ${revisionVersion} summary`
    };
  });
};

export const generateSeedDocuments = async (count: number): Promise<DocumentEntity[]> => {
  const basePages = await parseBasePages();

  return Array.from({ length: count }, (_, index) => {
    const basePage = basePages[index % basePages.length];
    const author = authorPool[index % authorPool.length];
    const tags = tagPools[index % tagPools.length];
    const createdAt = new Date(Date.now() - (count - index) * 3600000);
    const updatedAt = new Date(createdAt.getTime() + 1800000);
    const version = (index % 8) + 1;
    const title = `${basePage.title} ${index + 1}`;
    const content = `${basePage.text}

## Section ${index + 1}

This collaborative document discusses ${tags.join(", ")} and includes operational guidance for teams building shared editors with MongoDB.`;
    const useOldAuthorSchema = index % 10 === 0;

    return {
      slug: normalizeSlug(title),
      title,
      content,
      version,
      tags,
      metadata: {
        author: useOldAuthorSchema ? author.name : author,
        createdAt,
        updatedAt,
        wordCount: getWordCount(content)
      },
      revision_history: buildRevisionHistory(version, author.id ?? "unknown", updatedAt)
    };
  });
};
