export type ConfLevel = "alta" | "media";

export type Confidence = {
  debitore: ConfLevel;
  cf: ConfLevel;
  importo: ConfLevel;
  scadenza: ConfLevel;
  tribunale: ConfLevel;
};

export type PositionFields = {
  debitore: string;
  cf: string;
  creditore: string;
  importo: number | string;
  scadenza: string;
  contrattoN: string;
  tipoTitolo: string;
  tribunale: string;
  note: string;
};

export type DocTypeId = "messa-in-mora" | "piano-di-pagamento" | "decreto";

export type ReviewStatus = "in-revisione" | "approvato" | "rifiutato";

export type BaseStatus = "caricato" | "generato" | "esportato";

export type RowStatus = BaseStatus | ReviewStatus;

export type PortfolioRow = {
  id: string;
  docs: string[];
  baseStatus: BaseStatus;
  fields: PositionFields;
  conf: Confidence;
  draftText: string;
  docType: DocTypeId | null;
  review: ReviewStatus | null;
};

export type RawRow = {
  debitore: string;
  cf: string;
  creditore: string;
  importo: number;
  scadenza: string;
  contrattoN: string;
  tipoTitolo: string;
  tribunale: string;
  docs: string[];
  conf: Confidence;
};
