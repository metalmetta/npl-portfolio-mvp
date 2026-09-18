// @ts-nocheck
import React from "react";
import {
  Upload, Sparkles, FileText, Info, LayoutTemplate, X, Eye, Copy, Download,
  RotateCcw, CircleDot, CheckCircle2, AlertTriangle, ChevronRight,
} from "lucide-react";
import { LOGO_SRC, BRAND } from "./data";
import { eur, formatMinutes, StatusPill, ConfDot, FieldInput } from "./helpers";
import { MetricCard, ProgressLine, WhyContent, MappingContent } from "./extras";

export function ViewsBody({ p }: { p: any }) {
  const {
    AlertTriangle, BRAND, CheckCircle2, ChevronRight, CircleDot, ConfDot, Copy, Download,
    Eye, FieldInput, FileText, Info, LOGO_SRC, LayoutTemplate, MappingContent, MetricCard,
    ProgressLine, RotateCcw, STEPS, Sparkles, StatusPill, Upload, WhyContent, X,
    activeBlockers, allExtracted, allGenerated, allLoaded, canExport, closeDrawer, copyDraft,
    currentStep, derivedStatus, dismissIssue, drawer, drawerOpen, eur, exportPackage, exported,
    extractIdx, extracting, formatMinutes, genIdx, generatedCount, generating, issuesMap,
    loadDemoDataset, minutesSaved, noneExtracted, openDrawer, previewRow, resetAll, rows,
    runExtraction, runGeneration, simulateUpload, toast, totalClaimed, updateField, uploading,
  } = p;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO_SRC} alt="Lexroom" className="h-6 w-auto" />
              <span className="h-5 w-px bg-slate-200" />
              <h1 className="font-serif text-xl">Decreti NPL — MVP bulk</h1>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Un portafoglio, n decreti pronti al deposito</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openDrawer({ type: "why" })} className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
              <Info className="h-3.5 w-3.5" /> Perché questo demo
            </button>
            <button onClick={() => allLoaded && openDrawer({ type: "mapping" })} disabled={!allLoaded} className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              <LayoutTemplate className="h-3.5 w-3.5" /> Mappatura template
            </button>
            {allLoaded && (
              <button onClick={resetAll} className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50">
                <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
              </button>
            )}
          </div>
        </div>
        {allLoaded && (
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 pb-3 text-sm">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-1.5">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i < currentStep ? "bg-slate-900 text-white" : i === currentStep ? "text-white" : "bg-slate-100 text-slate-400"}`} style={i === currentStep ? { backgroundColor: BRAND } : undefined}>
                    {i < currentStep ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={i === currentStep ? "font-medium text-slate-900" : "text-slate-400"}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 pb-28">
        {!allLoaded ? (
          <div className="mx-auto mt-10 max-w-xl rounded border border-slate-200 bg-white p-10 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8" style={{ color: BRAND }} />
            <h2 className="font-serif text-lg">1 cartella → n decreti pronti al deposito</h2>
            <p className="mt-2 text-sm text-slate-500">Carica un portafoglio NPL: Lexroom estrae i dati, mappa il template e genera le bozze con validazione.</p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <button onClick={simulateUpload} disabled={uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: BRAND }}>
                <Upload className="h-4 w-4" />{uploading ? "Caricamento…" : "Carica portafoglio NPL"}
              </button>
              <button onClick={loadDemoDataset} className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-700">Carica dataset demo (12 posizioni)</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard label="Posizioni" value={rows.length} />
              <MetricCard label="Decreti generati" value={`${generatedCount}/${rows.length}`} />
              <MetricCard label="Totale reclamato" value={eur(totalClaimed)} />
              <MetricCard label="Tempo stimato risparmiato" value={formatMinutes(minutesSaved)} />
            </div>
            <div className="overflow-x-auto rounded border border-slate-200 bg-white">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                    <th className="px-3 py-2 font-medium">Stato</th>
                    <th className="px-3 py-2 font-medium">Debitore</th>
                    <th className="px-3 py-2 font-medium">CF / P.IVA</th>
                    <th className="px-3 py-2 font-medium">Importo</th>
                    <th className="px-3 py-2 font-medium">Tribunale</th>
                    <th className="px-3 py-2 font-medium">Docs</th>
                    <th className="px-3 py-2 font-medium">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const status = derivedStatus(r);
                    const revealed = r.baseStatus !== "da-estrarre";
                    const issues = issuesMap[r.id] || [];
                    return (
                      <React.Fragment key={r.id}>
                        <tr className="border-b border-slate-100 align-top hover:bg-slate-50/60">
                          <td className="px-3 py-2"><StatusPill status={status} /></td>
                          <td className="px-3 py-2">{revealed ? <span className="flex items-center">{r.fields.debitore}<ConfDot level={r.conf.debitore} /></span> : <span className="text-slate-300">—</span>}</td>
                          <td className="px-3 py-2">{revealed ? <FieldInput value={r.fields.cf} onChange={(v) => updateField(r.id, "cf", v)} error={issues.some((i) => i.key === "cf")} mono placeholder="mancante" /> : <span className="text-slate-300">—</span>}</td>
                          <td className="px-3 py-2">{revealed ? <span className="flex items-center"><FieldInput value={r.fields.importo} onChange={(v) => updateField(r.id, "importo", v.replace(/[^0-9]/g, ""))} error={issues.some((i) => i.key === "importo")} /><ConfDot level={r.conf.importo} /></span> : <span className="text-slate-300">—</span>}</td>
                          <td className="px-3 py-2">{revealed ? <FieldInput value={r.fields.tribunale} onChange={(v) => updateField(r.id, "tribunale", v)} error={issues.some((i) => i.key === "tribunale")} placeholder="n/d" /> : <span className="text-slate-300">—</span>}</td>
                          <td className="px-3 py-2"><div className="flex max-w-[140px] flex-wrap gap-1">{r.docs.map((d) => <span key={d} className="rounded-sm border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500">{d}</span>)}</div></td>
                          <td className="px-3 py-2">{(status === "generato" || status === "da-validare" || status === "esportato") && (
                            <button onClick={() => openDrawer({ type: "preview", id: r.id })} className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: BRAND }}><Eye className="h-3.5 w-3.5" /> Anteprima</button>
                          )}</td>
                        </tr>
                        {issues.length > 0 && (
                          <tr className="border-b border-rose-100 bg-rose-50/70">
                            <td colSpan={7} className="px-3 py-1.5">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rose-800">
                                <span className="inline-flex items-center gap-1 font-medium"><AlertTriangle className="h-3.5 w-3.5" /> da validare</span>
                                {issues.map((iss) => (
                                  <span key={iss.key} className="inline-flex items-center gap-1.5">{iss.label}
                                    <button onClick={() => dismissIssue(r.id, iss.key)} className="text-rose-400 underline decoration-dotted hover:text-rose-600">ignora</button>
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
            <div className="min-w-[220px] flex-1">
              {extracting && <ProgressLine label={`Estrazione… ${extractIdx}/${rows.length}`} pct={(extractIdx / rows.length) * 100} />}
              {generating && <ProgressLine label={`Generazione… ${genIdx}/${rows.length}`} pct={(genIdx / rows.length) * 100} />}
              {!extracting && !generating && allGenerated && !exported && (
                <div className="text-sm">{activeBlockers > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-rose-700"><AlertTriangle className="h-4 w-4" /> errori × {activeBlockers} — risolvi o ignora</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-teal-700"><CheckCircle2 className="h-4 w-4" /> Validazione ok — pronto all'export</span>
                )}</div>
              )}
              {exported && <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><CheckCircle2 className="h-4 w-4 text-teal-700" /> Esportato — {rows.length} decreti</span>}
              {!extracting && !generating && noneExtracted && <span className="text-sm text-slate-500">{rows.length} posizioni caricate</span>}
              {!extracting && !generating && allExtracted && !allGenerated && <span className="text-sm text-slate-500">Dati estratti — genera le bozze</span>}
            </div>
            <div className="flex items-center gap-2">
              {!extracting && noneExtracted && (
                <button onClick={runExtraction} className="inline-flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                  <CircleDot className="h-4 w-4" /> Estrai dati ({rows.length})
                </button>
              )}
              {!generating && allExtracted && !allGenerated && (
                <button onClick={runGeneration} className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-white hover:brightness-110" style={{ backgroundColor: BRAND }}>
                  <Sparkles className="h-4 w-4" /> Genera {rows.length} decreti
                </button>
              )}
              {allGenerated && !exported && (
                <button onClick={exportPackage} disabled={!canExport} className="inline-flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-300">
                  <Download className="h-4 w-4" /> Esporta pacchetto
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-20 right-6 z-50 rounded-sm bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}

      {drawer && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-200 ${drawerOpen ? "opacity-100" : "opacity-0"}`} onClick={closeDrawer} />
          <div className={`relative h-full w-full max-w-md overflow-y-auto bg-white shadow-xl transition-transform duration-200 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="font-serif text-base">{drawer.type === "why" && "Perché questo demo"}{drawer.type === "mapping" && "Mappatura template"}{drawer.type === "preview" && "Anteprima decreto"}</h3>
              <button onClick={closeDrawer} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="px-5 py-4">
              {drawer.type === "why" && <WhyContent />}
              {drawer.type === "mapping" && <MappingContent />}
              {drawer.type === "preview" && previewRow && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">{previewRow.fields.debitore}</span>
                    <button onClick={() => copyDraft(previewRow.draftText)} className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: BRAND }}><Copy className="h-3.5 w-3.5" /> Copia</button>
                  </div>
                  <div className="whitespace-pre-wrap rounded border border-slate-300 bg-white p-5 font-serif text-sm leading-relaxed shadow-inner">{previewRow.draftText}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
