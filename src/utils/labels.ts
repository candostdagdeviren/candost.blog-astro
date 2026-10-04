// Tags and categories share one frontmatter shape (an array, or a single
// comma-separated string; see content.config.ts), so both are handled here,
// parameterised by field, rather than by a copy of each helper per field.

export type LabelField = "tags" | "category";

type LabelValue = string | string[] | null | undefined;
type Labelled = { data: Partial<Record<LabelField, LabelValue>> };

export const toLabels = (value: LabelValue): string[] => {
  if (!value) return [];
  return typeof value === "string" ? value.split(",") : [...value];
};

/** Every distinct non-empty label in first-seen order. */
export const uniqueLabels = (entries: Labelled[], field: LabelField): string[] => {
  const labels = new Set(entries.flatMap((entry) => toLabels(entry.data[field])));
  return [...labels].filter(Boolean);
};

export const entriesWithLabel = <T extends Labelled>(
  entries: T[],
  field: LabelField,
  label: string,
): T[] => entries.filter((entry) => toLabels(entry.data[field]).includes(label));
