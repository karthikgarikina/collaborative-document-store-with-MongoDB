export interface AuthorInfo {
  id: string | null;
  name: string;
  email: string | null;
}

export interface DocumentRecord {
  slug: string;
  title: string;
  content: string;
  version: number;
  tags: string[];
  metadata: {
    author: AuthorInfo;
    createdAt: string;
    updatedAt: string;
    wordCount: number;
  };
  revision_history: Array<{
    version: number;
    updatedAt: string;
    authorId: string;
    contentDiff: string;
  }>;
  score?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL. Configure it in the frontend environment before building.");
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    const error = new Error(payload.message ?? "Request failed") as Error & {
      status?: number;
      payload?: unknown;
    };
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const api = {
  listDocuments: () => request<DocumentRecord[]>("/documents"),
  getDocument: (slug: string) => request<DocumentRecord>(`/documents/${slug}`),
  createDocument: (payload: {
    title: string;
    content: string;
    tags: string[];
    authorName: string;
    authorEmail: string;
  }) =>
    request<DocumentRecord>("/documents", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateDocument: (slug: string, payload: { title: string; content: string; tags: string[]; version: number }) =>
    request<DocumentRecord>(`/documents/${slug}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  searchDocuments: (query: string, tags: string[]) => {
    const params = new URLSearchParams({ q: query });
    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    }

    return request<DocumentRecord[]>(`/search?${params.toString()}`);
  }
};
