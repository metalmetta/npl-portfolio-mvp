import type { ConfLevel, Issue, PortfolioRow, RowStatus } from "./types";
import { RAW_ROWS } from "./data";

export function buildInitialRows(): PortfolioRow[] {
  return RAW_ROWS.map((r, i) => ({
    id: `pos-${i + 1}`,
    docs: r.docs,
    baseStatus: "da-estrarre", // da-estrarre | pronto | generato | esportato
    fields: {
      debitore: r.debitore,
      cf: r.cf,
      creditore: r.creditore,
      importo: r.importo,
      scadenza: r.scadenza,
      contrattoN: r.contrattoN,
      tipoTitolo: r.tipoTitolo,
      tribunale: r.tribunale,
      note: "",
    },
    conf: r.conf,
    draftText: "",
  }));
}

export const eur = (n: number | string) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );

export function formatMinutes(m: number) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}

export function computeIssues(rows: PortfolioRow[], dismissed: Set<string>) {
  const groups: Record<string, string[]> = {};
  rows.forEach((r) => {
    if (r.fields.debitore && r.fields.importo) {
      const key = r.fields.debitore.trim().toLowerCase() + "|" + r.fields.importo;
      groups[key] = groups[key] || [];
      groups[key].push(r.id);
    }
  });

  const map: Record<string, Issue[]> = {};
  rows.forEach((r) => {
    const list = [];
    if (!r.fields.cf || !r.fields.cf.trim()) list.push({ key: "cf", label: "CF / P.IVA mancante" });
    if (!r.fields.importo || Number(r.fields.importo) === 0)
      list.push({ key: "importo", label: "Importo pari a zero" });
    if (!r.fields.tipoTitolo || !r.fields.tipoTitolo.trim()) list.push({ key: "titolo", label: "Titolo assente" });
    if (!r.fields.tribunale || !r.fields.tribunale.trim())
      list.push({ key: "tribunale", label: "Tribunale non indicato" });
    const key = (r.fields.debitore || "").trim().toLowerCase() + "|" + r.fields.importo;
    if (r.fields.debitore && r.fields.importo && groups[key] && groups[key].length > 1)
      list.push({ key: "duplicato", label: "Posizione duplicata (stesso debitore e importo)" });

    map[r.id] = list.filter((i) => !dismissed.has(r.id + ":" + i.key));
  });
  return map;
}

export function generateDraft(row: PortfolioRow) {
  const f = row.fields;
  return `TRIBUNALE DI ${(f.tribunale||"?").toUpperCase()}

RICORSO PER DECRETO INGIUNTIVO

Ricorrente: ${f.creditore}
Intimato: ${f.debitore} (${f.cf||"n/d"})
Importo: ${eur(f.importo)}
Scadenza: ${f.scadenza}
Titolo: ${f.tipoTitolo}
Docs: ${row.docs.join(", ")}

— bozza Lexroom —`;
}

export function StatusPill({ status }: { status: RowStatus }) {
  const map: Record<RowStatus, { label: string; cls: string }> = {
    "da-estrarre": { label: "Da estrarre", cls: "bg-slate-100 text-slate-500 border-slate-200" },
    pronto: { label: "Pronto", cls: "bg-amber-50 text-amber-800 border-amber-200" },
    generato: { label: "Generato", cls: "bg-teal-50 text-teal-800 border-teal-200" },
    "da-validare": { label: "Da validare", cls: "bg-rose-50 text-rose-800 border-rose-200" },
    esportato: { label: "Esportato", cls: "bg-slate-900 text-white border-slate-900" },
  };
  const s = map[status] || map["da-estrarre"];
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function ConfDot({ level }: { level: ConfLevel }) {
  if (level !== "media") return null;
  return (
    <span
      title="Confidenza media — verifica il dato"
      className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle"
    />
  );
}

export function FieldInput({
  value,
  onChange,
  error,
  mono,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string) => void;
  error?: boolean;
  mono?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full min-w-[7rem] rounded-sm border-b bg-transparent px-1 py-0.5 text-sm outline-none transition-colors ${
        mono ? "font-mono text-xs" : ""
      } ${
        error
          ? "border-rose-400 bg-rose-50 text-rose-900"
          : "border-transparent text-slate-800 hover:border-slate-300 focus:border-amber-600"
      }`}
    />
  );
}
