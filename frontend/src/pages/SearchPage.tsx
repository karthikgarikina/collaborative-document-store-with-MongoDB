import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, DocumentRecord } from "../services/api";

export const SearchPage = (): JSX.Element => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecent = async () => {
    setLoading(true);

    try {
      const data = await api.listDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecent();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      await loadRecent();
      return;
    }

    setLoading(true);
    try {
      const data = await api.searchDocuments(
        query,
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      );
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <div className="card workspace-card">
        <div className="section-heading">
          <h2>Search Documents</h2>
          <p>Use keywords for full-text search and tags for narrowing results to the exact content set you need.</p>
        </div>

        <div className="search-bar">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or content"
          />
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Filter tags" />
          <button onClick={() => void handleSearch()} type="button">
            Search
          </button>
        </div>
      </div>

      <div className="card workspace-summary">
        <div>
          <p className="eyebrow">Results</p>
          <h3>{query.trim() ? "Filtered matches" : "Recent documents"}</h3>
        </div>
        <div className="summary-stats">
          <span className="summary-chip">{documents.length} documents</span>
          <span className="summary-chip">{tags.trim() ? `tags: ${tags}` : "all tags"}</span>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="card status-card">Loading documents...</p> : null}

      <div className="grid">
        {documents.map((document) => (
          <article className="card document-card" key={document.slug}>
            <div className="card-row">
              <h2>{document.title}</h2>
              <span className="badge">v{document.version}</span>
            </div>
            <p className="document-snippet">{document.content.slice(0, 160)}...</p>
            <p className="meta">
              {document.tags.join(", ")} | {document.metadata.author.name}
            </p>
            <div className="card-row card-footer">
              <Link className="text-link" to={`/documents/${document.slug}`}>
                View document
              </Link>
              {typeof document.score === "number" ? <span>score {document.score.toFixed(2)}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
