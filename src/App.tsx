import { Fragment, useEffect, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileText,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { buildInitialRows } from "./data/portfolio";
import {
  BOOKING_URL,
  BRAND,
  DOC_TYPES,
  LANDING_HOOK,
  docTypeLabel,
  eur,
  exportFileName,
  generateDraft,
} from "./data/drafts";
import type { DocTypeId, PortfolioRow, PositionFields, ReviewStatus, RowStatus } from "./types";

type DrawerState = { type: "preview"; id: string };

const MIXED_TYPES: DocTypeId[] = ["messa-in-mora", "piano-di-pagamento", "decreto"];

function hydrateBook(mode: "mixed" | DocTypeId): PortfolioRow[] {
  return buildInitialRows().map((row, i) => {
    const docType = mode === "mixed" ? MIXED_TYPES[i % MIXED_TYPES.length] : mode;
    return {
      ...row,
      baseStatus: "generato",
      docType,
      review: "in-revisione",
      draftText: generateDraft(row, docType),
    };
  });
}

function StatusPill({ status }: { status: RowStatus }) {
  const map: Record<RowStatus, { label: string; cls: string }> = {
    caricato: { label: "Caricato", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    generato: { label: "Generato", cls: "bg-teal-50 text-teal-800 border-teal-200" },
    "in-revisione": { label: "Da revisionare", cls: "bg-amber-50 text-amber-900 border-amber-200" },
    approvato: { label: "Approvato", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    rifiutato: { label: "Rifiutato", cls: "bg-rose-50 text-rose-800 border-rose-200" },
    esportato: { label: "Esportato", cls: "bg-slate-900 text-white border-slate-900" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ConfDot({ level }: { level: "alta" | "media" }) {
  if (level !== "media") return null;
  return (
    <span
      title="Confidenza media — verifica il dato"
      className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle"
    />
  );
}

function FieldInput({
  value,
  onChange,
  mono,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string) => void;
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
      } border-transparent text-slate-800 hover:border-slate-300 focus:border-amber-600`}
    />
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-serif text-lg text-slate-900">{value}</div>
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genIdx, setGenIdx] = useState(0);
  const [pendingType, setPendingType] = useState<DocTypeId | "mixed" | null>(null);
  const [bulkType, setBulkType] = useState<DocTypeId>("messa-in-mora");
  const [exported, setExported] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function openDrawer(id: string) {
    setDrawer({ type: "preview", id });
    requestAnimationFrame(() => setDrawerOpen(true));
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setDrawer(null), 200);
  }

  function loadDemoDataset() {
    const next = hydrateBook("mixed");
    setRows(next);
    setExported(false);
    showToast("Dataset demo: 12 posizioni, campi popolati, 12 bozze da revisionare");
  }

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => {
      setRows(hydrateBook("mixed"));
      setUploading(false);
      setExported(false);
      showToast("Portafoglio caricato: 12 posizioni con bozze pronte alla revisione");
    }, 700);
  }

  function resetAll() {
    setRows([]);
    setGenerating(false);
    setGenIdx(0);
    setPendingType(null);
    setExported(false);
    closeDrawer();
  }

  useEffect(() => {
    if (!generating || pendingType === null) return;
    if (genIdx >= rows.length) {
      setGenerating(false);
      setPendingType(null);
      showToast(`Generate ${rows.length} bozze — in revisione`);
      return;
    }
    const t = setTimeout(() => {
      const mode = pendingType;
      setRows((prev) =>
        prev.map((r, i) => {
          if (i !== genIdx) return r;
          const docType = mode === "mixed" ? MIXED_TYPES[i % MIXED_TYPES.length] : mode;
          return {
            ...r,
            baseStatus: "generato",
            docType,
            review: "in-revisione",
            draftText: generateDraft(r, docType),
          };
        }),
      );
      setGenIdx((i) => i + 1);
    }, 160);
    return () => clearTimeout(t);
  }, [generating, genIdx, pendingType, rows.length]);

  function regenerateAll(mode: DocTypeId | "mixed") {
    setExported(false);
    setPendingType(mode);
    setGenIdx(0);
    setGenerating(true);
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        baseStatus: "caricato",
        draftText: "",
        review: null,
        docType: null,
      })),
    );
  }

  function updateField(id: string, key: keyof PositionFields, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, fields: { ...r.fields, [key]: value } } : r)));
  }

  function changeRowType(id: string, docType: DocTypeId) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              docType,
              draftText: generateDraft(r, docType),
              review: "in-revisione",
              baseStatus: "generato",
            }
          : r,
      ),
    );
    setExported(false);
  }

  function setReview(id: string, review: ReviewStatus) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, review, baseStatus: review === "approvato" ? "generato" : r.baseStatus } : r)),
    );
    setExported(false);
  }

  function derivedStatus(row: PortfolioRow): RowStatus {
    if (row.baseStatus === "esportato") return "esportato";
    if (row.review) return row.review;
    if (row.baseStatus === "generato") return "in-revisione";
    return row.baseStatus;
  }

  const allLoaded = rows.length > 0;
  const generatedCount = rows.filter((r) => r.draftText).length;
  const pendingReview = rows.filter((r) => r.draftText && r.review === "in-revisione").length;
  const approvedCount = rows.filter((r) => r.review === "approvato" || r.baseStatus === "esportato").length;
  const rejectedCount = rows.filter((r) => r.review === "rifiutato").length;
  const canExport = approvedCount > 0 && !exported && !generating;
  const totalClaimed = rows.reduce((s, r) => s + (Number(r.fields.importo) || 0), 0);

  const STEPS = [
    { key: "portafoglio", label: "Portafoglio" },
    { key: "bozze", label: "Bozze" },
    { key: "revisione", label: "Revisione" },
    { key: "esportazione", label: "Esportazione" },
  ];
  let currentStep = 0;
  if (!allLoaded) currentStep = 0;
  else if (generating || generatedCount === 0) currentStep = 1;
  else if (!exported) currentStep = pendingReview > 0 ? 2 : 3;
  else currentStep = 3;

  function exportPackage() {
    const approved = rows.filter((r) => r.review === "approvato" || r.baseStatus === "esportato");
    if (approved.length === 0) return;
    const bundle = approved
      .map((r, i) => {
        const tipo = docTypeLabel(r.docType);
        return `POSIZIONE ${i + 1} — ${r.fields.debitore} — ${tipo}\n${"=".repeat(64)}\n\n${r.draftText}`;
      })
      .join("\n\n\n");
    const blob = new Blob([bundle], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName(approved[0]?.docType ?? null, approved.length);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setRows((prev) =>
      prev.map((r) => (r.review === "approvato" ? { ...r, baseStatus: "esportato" } : r)),
    );
    setExported(true);
    showToast(`Esportate ${approved.length} bozze approvate`);
  }

  async function copyDraft(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Bozza copiata negli appunti");
    } catch {
      showToast("Copia non disponibile in questo ambiente");
    }
  }

  const previewRow = drawer ? rows.find((r) => r.id === drawer.id) : null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <img src="/lexroom-logo.png" alt="Lexroom" className="h-6 w-auto" />
              <span className="h-5 w-px bg-slate-200" />
              <h1 className="font-serif text-xl text-slate-900">NPL / debt collection</h1>
            </div>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">{LANDING_HOOK}</p>
          </div>
          <div className="flex items-center gap-2">
            {allLoaded && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Ricomincia
              </button>
            )}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
              style={{ backgroundColor: BRAND }}
            >
              <Calendar className="h-3.5 w-3.5" />
              Prenota una call
            </a>
          </div>
        </div>

        {allLoaded && (
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 pb-3 text-sm">
            {STEPS.map((s, i) => (
              <Fragment key={s.key}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      i < currentStep
                        ? "bg-slate-900 text-white"
                        : i === currentStep
                          ? "text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}
                    style={i === currentStep ? { backgroundColor: BRAND } : undefined}
                  >
                    {i < currentStep ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={i === currentStep ? "font-medium text-slate-900" : "text-slate-400"}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 pb-28">
        {!allLoaded ? (
          <Landing uploading={uploading} onDemo={loadDemoDataset} onUpload={simulateUpload} />
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard label="Posizioni" value={rows.length} />
              <MetricCard label="Bozze generate" value={`${generatedCount}/${rows.length}`} />
              <MetricCard label="Da revisionare" value={pendingReview} />
              <MetricCard label="Approvate" value={approvedCount} />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-600">
                Book da fabbrica legale — {rows.length} posizioni, tre tipi di atto. Totale reclamato{" "}
                <span className="font-medium text-slate-900">{eur(totalClaimed)}</span>
                {rejectedCount > 0 ? ` · ${rejectedCount} rifiutate` : ""}.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs text-slate-500" htmlFor="bulk-type">
                  Rigenera tutte come
                </label>
                <select
                  id="bulk-type"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value as DocTypeId)}
                  className="rounded-sm border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => regenerateAll(bulkType)}
                  disabled={generating}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Rigenera {rows.length} bozze
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded border border-slate-200 bg-white">
              <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                    <th className="px-3 py-2 font-medium">Stato</th>
                    <th className="px-3 py-2 font-medium">Tipo atto</th>
                    <th className="px-3 py-2 font-medium">Debitore</th>
                    <th className="px-3 py-2 font-medium">CF / P.IVA</th>
                    <th className="px-3 py-2 font-medium">Creditore</th>
                    <th className="px-3 py-2 font-medium">Importo</th>
                    <th className="px-3 py-2 font-medium">Scadenza</th>
                    <th className="px-3 py-2 font-medium">Titolo</th>
                    <th className="px-3 py-2 font-medium">Tribunale</th>
                    <th className="px-3 py-2 font-medium">Revisione</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const status = derivedStatus(r);
                    return (
                      <tr key={r.id} className="border-b border-slate-100 align-top hover:bg-slate-50/60">
                        <td className="px-3 py-2">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={r.docType ?? ""}
                            onChange={(e) => changeRowType(r.id, e.target.value as DocTypeId)}
                            className="max-w-[11rem] rounded-sm border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-800"
                          >
                            {DOC_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.short}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center text-sm text-slate-800">
                            {r.fields.debitore}
                            <ConfDot level={r.conf.debitore} />
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <FieldInput
                            value={r.fields.cf}
                            onChange={(v) => updateField(r.id, "cf", v)}
                            mono
                            placeholder="mancante"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-600">{r.fields.creditore}</td>
                        <td className="px-3 py-2">
                          <span className="flex items-center text-sm">
                            <FieldInput
                              value={r.fields.importo}
                              onChange={(v) => updateField(r.id, "importo", v.replace(/[^0-9]/g, ""))}
                            />
                            <ConfDot level={r.conf.importo} />
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center text-sm text-slate-700">
                            {r.fields.scadenza}
                            <ConfDot level={r.conf.scadenza} />
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <FieldInput
                            value={r.fields.tipoTitolo}
                            onChange={(v) => updateField(r.id, "tipoTitolo", v)}
                            placeholder="assente"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center text-sm">
                            <FieldInput
                              value={r.fields.tribunale}
                              onChange={(v) => updateField(r.id, "tribunale", v)}
                              placeholder="non indicato"
                            />
                            <ConfDot level={r.conf.tribunale} />
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {r.draftText ? (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => openDrawer(r.id)}
                                className="inline-flex items-center gap-1 text-xs font-medium hover:brightness-110"
                                style={{ color: BRAND }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Anteprima
                              </button>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setReview(r.id, "approvato")}
                                  className="rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-800 hover:bg-emerald-100"
                                >
                                  Approva
                                </button>
                                <button
                                  onClick={() => setReview(r.id, "rifiutato")}
                                  className="rounded-sm border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] text-rose-800 hover:bg-rose-100"
                                >
                                  Rifiuta
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {allLoaded && (
        <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
            <div className="min-w-[220px] flex-1 text-sm text-slate-600">
              {generating && (
                <div>
                  <div className="mb-1">
                    Generazione in corso… {genIdx}/{rows.length}
                  </div>
                  <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-amber-600 transition-all"
                      style={{ width: `${rows.length ? (genIdx / rows.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
              {!generating && !exported && (
                <span>
                  {pendingReview > 0
                    ? `${pendingReview} bozze da revisionare — approva o rifiuta prima di chiudere il pacchetto.`
                    : approvedCount > 0
                      ? `${approvedCount} bozze approvate pronte all'esportazione.`
                      : "Nessuna bozza approvata."}
                </span>
              )}
              {exported && (
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <Check className="h-4 w-4 text-teal-700" />
                  Pacchetto esportato — {approvedCount} bozze approvate
                </span>
              )}
            </div>
            <button
              onClick={exportPackage}
              disabled={!canExport}
              className="inline-flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Download className="h-4 w-4" />
              Esporta approvate{approvedCount > 0 ? ` (${approvedCount})` : ""}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 right-6 z-50 rounded-sm bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {drawer && previewRow && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-200 ${
              drawerOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDrawer}
          />
          <div
            className={`relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl transition-transform duration-200 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-serif text-base text-slate-900">{docTypeLabel(previewRow.docType)}</h3>
                <p className="text-xs text-slate-500">{previewRow.fields.debitore}</p>
              </div>
              <button onClick={closeDrawer} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <StatusPill status={derivedStatus(previewRow)} />
                <div className="flex gap-2">
                  <button
                    onClick={() => copyDraft(previewRow.draftText)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium hover:brightness-110"
                    style={{ color: BRAND }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copia
                  </button>
                  <button
                    onClick={() => setReview(previewRow.id, "approvato")}
                    className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
                  >
                    Approva
                  </button>
                  <button
                    onClick={() => setReview(previewRow.id, "rifiutato")}
                    className="rounded-sm border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800"
                  >
                    Rifiuta
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap rounded border border-slate-300 bg-white p-5 font-serif text-sm leading-relaxed text-slate-800 shadow-inner">
                {previewRow.draftText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Landing({
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
          fabbrica legale (~10.000 atti/mese). Ogni bozza passa da revisione umana prima dell&apos;export.
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
          Il dataset demo apre 12 posizioni già compilate, con bozze miste dei tre tipi di atto, pronte da leggere,
          approvare o rifiutare.
        </p>
      </div>
    </div>
  );
}
