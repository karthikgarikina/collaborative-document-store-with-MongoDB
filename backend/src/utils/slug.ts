export const normalizeSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const buildUniqueSlug = async (
  source: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> => {
  const baseSlug = normalizeSlug(source) || "document";
  let slug = baseSlug;
  let counter = 1;

  while (await exists(slug)) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};
