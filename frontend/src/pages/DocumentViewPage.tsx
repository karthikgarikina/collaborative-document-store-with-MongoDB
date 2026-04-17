import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, DocumentRecord } from "../services/api";

export const DocumentViewPage = (): JSX.Element => {
  const { slug = "" } = useParams();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const data = await api.getDocument(slug);
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document");
      }
    };

    void loadDocument();
  }, [slug]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!document) {
    return <p>Loading document...</p>;
  }

  return (
    <section className="stack">
      <div className="card workspace-summary">
        <div>
          <p className="eyebrow">Viewing Document</p>
          <h3>{document.title}</h3>
        </div>
        <div className="summary-stats">
          <span className="summary-chip">version {document.version}</span>
          <span className="summary-chip">{document.metadata.wordCount} words</span>
        </div>
      </div>

      <article className="card document-view-card">
        <div className="card-row">
          <div>
            <p className="eyebrow">{document.slug}</p>
            <h2>{document.title}</h2>
          </div>
          <Link className="action-link" to={`/documents/${document.slug}/edit`}>
            Edit document
          </Link>
        </div>

        <p className="meta">
          Version {document.version} | {document.metadata.author.name} | {document.tags.join(", ")}
        </p>
        <pre className="document-content">{document.content}</pre>
      </article>

      <article className="card">
        <h3>Recent revisions</h3>
        {document.revision_history.length === 0 ? <p>No revisions yet.</p> : null}
        {document.revision_history
          .slice()
          .reverse()
          .map((revision) => (
            <div className="revision" key={`${revision.version}-${revision.updatedAt}`}>
              <strong>v{revision.version}</strong>
              <span>{new Date(revision.updatedAt).toLocaleString()}</span>
              <p>{revision.contentDiff}</p>
            </div>
          ))}
      </article>
    </section>
  );
};
