import { useNavigate } from "react-router-dom";
import { DocumentForm } from "../components/DocumentForm";
import { api } from "../services/api";

export const DocumentCreatePage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="stack">
      <div className="card workspace-card">
        <div className="section-heading">
          <h2>Create A New Document</h2>
          <p>
            Fill in the title, tags, author information, and content. Once saved, the backend will generate the slug
            and initialize version tracking automatically.
          </p>
        </div>
      </div>

      <DocumentForm
        includeAuthorFields
        submitLabel="Create document"
        onSubmit={async (payload) => {
          const created = await api.createDocument({
            title: payload.title,
            content: payload.content,
            tags: payload.tags,
            authorName: payload.authorName ?? "Unknown Author",
            authorEmail: payload.authorEmail ?? "unknown@example.com"
          });
          navigate(`/documents/${created.slug}`);
        }}
      />
    </section>
  );
};
