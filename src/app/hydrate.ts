import { buildInitialRows } from "../data/portfolio";
import { generateDraft } from "../data/drafts";
import type { DocTypeId, PortfolioRow } from "../types";

export const MIXED_TYPES: DocTypeId[] = ["messa-in-mora", "piano-di-pagamento", "decreto"];

export function hydrateBook(mode: "mixed" | DocTypeId): PortfolioRow[] {
  return buildInitialRows().map((row, i) => {
    const docType = mode === "mixed" ? MIXED_TYPES[i % MIXED_TYPES.length] : mode;
    return {
      ...row,
      baseStatus: "generato",
      docType,
      review: "approvato",
      draftText: generateDraft(row, docType),
    };
  });
}
