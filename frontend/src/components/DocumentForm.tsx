import { FormEvent, useState } from "react";
import { DocumentRecord } from "../services/api";

interface DocumentFormProps {
  initialValue?: Partial<DocumentRecord>;
  onSubmit: (payload: { title: string; content: string; tags: string[]; authorName?: string; authorEmail?: string }) => Promise<void>;
  includeAuthorFields?: boolean;
  submitLabel: string;
}

export const DocumentForm = ({
  initialValue,
  onSubmit,
  includeAuthorFields = false,
  submitLabel
}: DocumentFormProps): JSX.Element => {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [content, setContent] = useState(initialValue?.content ?? "");
  const [tags, setTags] = useState((initialValue?.tags ?? []).join(", "));
  const [authorName, setAuthorName] = useState(initialValue?.metadata?.author.name ?? "");
  const [authorEmail, setAuthorEmail] = useState(initialValue?.metadata?.author.email ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await onSubmit({
        title,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        authorName,
        authorEmail
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="section-heading">
          <h2>Document Details</h2>
          <p>Start with the core identity of the page so it is easy to search and organize later.</p>
        </div>

        <div className="form-grid">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>

          <label>
            Tags
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="mongodb, guide" />
          </label>
        </div>
      </div>

      {includeAuthorFields ? (
        <div className="form-section">
          <div className="section-heading">
            <h2>Author Details</h2>
            <p>Capture the author information stored in document metadata for traceability.</p>
          </div>

          <div className="form-grid">
            <label>
              Author name
              <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} required />
            </label>
            <label>
              Author email
              <input
                value={authorEmail ?? ""}
                onChange={(event) => setAuthorEmail(event.target.value)}
                required
                type="email"
              />
            </label>
          </div>
        </div>
      ) : null}

      <div className="form-section">
        <div className="section-heading">
          <h2>Content Editor</h2>
          <p>Write the page body here. Word count and revision metadata will be updated automatically.</p>
        </div>

        <label>
          Content
          <textarea rows={14} value={content} onChange={(event) => setContent(event.target.value)} required />
        </label>
      </div>

      <div className="form-actions">
        <p className="meta">Changes are saved through the backend API with version-aware conflict protection.</p>
        <button disabled={saving} type="submit">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
