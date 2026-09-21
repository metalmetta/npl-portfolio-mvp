import { FileText, Sparkles, Upload } from "lucide-react";
import { BRAND, DOC_TYPES, LANDING_HOOK } from "../data/drafts";

export function Landing({
  uploading,
  onDemo,
  onUpload,
}: {
  uploading: boolean;
  onDemo: () => void;
  onUpload: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded border border-slate-200 bg-white px-8 py-10">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">Lexroom · fabbrica legale</p>
        <h2 className="mt-3 font-serif text-2xl leading-snug text-slate-900 sm:text-3xl">{LANDING_HOOK}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Portafoglio NPL in ingresso, bozze in uscita — messa in mora, piano di pagamento, decreto — per volumi da
          fabbrica legale (~10.000 atti/mese). Demo pre-approvata per il happy path; in produzione ogni bozza passa da revisione umana.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {DOC_TYPES.map((t) => (
            <div key={t.id} className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <FileText className="h-4 w-4" style={{ color: BRAND }} />
                {t.label}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{t.beat}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <button
            onClick={onDemo}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            style={{ backgroundColor: BRAND }}
          >
            <Sparkles className="h-4 w-4" />
            Carica dataset demo (12 posizioni)
          </button>
          <button
            onClick={onUpload}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Caricamento…" : "Carica portafoglio NPL"}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Il dataset demo apre 12 posizioni già compilate, con bozze miste dei tre tipi di atto già approvate — Esporta abilitato subito.
        </p>
      </div>
    </div>
  );
}
