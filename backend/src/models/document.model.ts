import { Schema, model } from "mongoose";

const revisionHistorySchema = new Schema(
  {
    version: { type: Number, required: true },
    updatedAt: { type: Date, required: true },
    authorId: { type: String, required: true },
    contentDiff: { type: String, required: true }
  },
  { _id: false }
);

const metadataSchema = new Schema(
  {
    author: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (value: unknown) => {
          if (typeof value === "string") {
            return value.trim().length > 0;
          }

          if (value && typeof value === "object") {
            const author = value as Record<string, unknown>;
            return typeof author.name === "string" && author.name.trim().length > 0;
          }

          return false;
        },
        message: "metadata.author must be a non-empty string or author object"
      }
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    wordCount: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const documentSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    version: { type: Number, required: true, min: 1, default: 1 },
    tags: [{ type: String, required: true, trim: true }],
    metadata: { type: metadataSchema, required: true },
    revision_history: { type: [revisionHistorySchema], default: [] }
  },
  {
    versionKey: false
  }
);

documentSchema.index({ title: "text", content: "text" });

export const DocumentModel = model("Document", documentSchema, "documents");
