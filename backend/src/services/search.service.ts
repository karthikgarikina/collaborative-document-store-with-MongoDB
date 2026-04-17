import { DocumentRepository } from "../repositories/document.repository";
import { SearchResult } from "../types/document";
import { applyLazyAuthorMigration } from "../utils/lazy-migration";

export class SearchService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async search(query: string, tags: string[]): Promise<SearchResult[]> {
    const mongoQuery: Record<string, unknown> = {
      $text: { $search: query }
    };

    if (tags.length > 0) {
      mongoQuery.tags = { $all: tags };
    }

    const results = await this.documentRepository.searchText(mongoQuery, 50);

    return results.map((result) => {
      const migrated = applyLazyAuthorMigration(result as unknown as SearchResult);

      return {
        ...migrated,
        score: typeof result.score === "number" ? result.score : 0
      };
    });
  }
}
