export const buildContentDiffSummary = (
  previousTitle: string,
  nextTitle: string,
  previousContent: string,
  nextContent: string
): string => {
  const summaryParts: string[] = [];

  if (previousTitle !== nextTitle) {
    summaryParts.push(`title changed from "${previousTitle}" to "${nextTitle}"`);
  }

  if (previousContent !== nextContent) {
    summaryParts.push(`content length ${previousContent.length} -> ${nextContent.length}`);
  }

  return summaryParts.length > 0 ? summaryParts.join("; ") : "metadata update";
};
