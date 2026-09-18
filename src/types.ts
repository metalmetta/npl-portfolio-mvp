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

export type BaseStatus = "da-estrarre" | "pronto" | "generato" | "esportato";
export type RowStatus = BaseStatus | "da-validare";

export type PortfolioRow = {
  id: string;
  docs: string[];
  baseStatus: BaseStatus;
  fields: PositionFields;
  conf: Confidence;
  draftText: string;
};

export type Issue = { key: string; label: string };

export type DrawerState = { type: "why" | "mapping" | "preview"; id?: string };

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
