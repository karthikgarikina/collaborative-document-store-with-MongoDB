import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentForm } from "../components/DocumentForm";
import { api, DocumentRecord } from "../services/api";

export const DocumentEditPage = (): JSX.Element => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
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
      <div className="card workspace-card">
        <div className="section-heading">
          <h2>Edit Document</h2>
          <p>
            Update the document safely. If someone else saves first, the backend will return a version conflict instead
            of overwriting their changes.
          </p>
        </div>
      </div>

      <DocumentForm
        initialValue={document}
        submitLabel="Save changes"
        onSubmit={async (payload) => {
          try {
            const updated = await api.updateDocument(slug, {
              title: payload.title,
              content: payload.content,
              tags: payload.tags,
              version: document.version
            });
            navigate(`/documents/${updated.slug}`);
          } catch (err) {
            const typedError = err as Error & { status?: number; payload?: unknown };
            if (typedError.status === 409) {
              window.alert("Version conflict detected. The latest server version has been loaded into view.");
              if (typedError.payload) {
                setDocument(typedError.payload as DocumentRecord);
              }
              return;
            }

            setError(typedError.message);
          }
        }}
      />
    </section>
  );
};
