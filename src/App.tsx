import { Fragment } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { BOOKING_URL, BRAND, DOC_TYPES, LANDING_HOOK, eur } from "./data/drafts";
import type { DocTypeId } from "./types";
import { MetricCard } from "./app/status";
import { Landing } from "./app/Landing";
import { PortfolioTable } from "./app/PortfolioTable";
import { PreviewDrawer } from "./app/PreviewDrawer";
import { useNplApp } from "./app/useNplApp";

export default function App() {
  const {
    rows, uploading, generating, genIdx, bulkType, setBulkType, exported, drawer, drawerOpen, toast,
    openDrawer, closeDrawer, loadDemoDataset, simulateUpload, resetAll, regenerateAll,
    updateField, changeRowType, setReview, approveAll, derivedStatus,
    allLoaded, generatedCount, pendingReview, approvedCount, rejectedCount, canExport, totalClaimed, STEPS, currentStep,
    exportPackage, copyDraft, previewRow,
  } = useNplApp();

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
            {STEPS.map((step, i) => (
              <Fragment key={step.key}>
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
                    {step.label}
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
                {pendingReview > 0 && (
                  <button
                    onClick={approveAll}
                    disabled={generating}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approva tutte
                  </button>
                )}
              </div>
            </div>

            <PortfolioTable
              rows={rows}
              derivedStatus={derivedStatus}
              changeRowType={changeRowType}
              updateField={updateField}
              openDrawer={openDrawer}
              setReview={setReview}
            />
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
        <PreviewDrawer
          open={drawerOpen}
          row={previewRow}
          derivedStatus={derivedStatus}
          onClose={closeDrawer}
          onCopy={copyDraft}
          onReview={setReview}
        />
      )}
    </div>
  );
}
