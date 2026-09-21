// @ts-nocheck
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Upload, Sparkles, FileText, LayoutTemplate, X, Eye, Copy, Download,
  RotateCcw, CircleDot, CheckCircle2, AlertTriangle, ChevronRight,
} from "lucide-react";
import type { DrawerState, Issue, PortfolioRow, PositionFields, RowStatus } from "./types";
import { LOGO_SRC, BRAND } from "./data";
import {
  buildInitialRows, eur, formatMinutes, computeIssues, generateDraft,
  StatusPill, ConfDot, FieldInput,
} from "./helpers";
import { MetricCard, ProgressLine, MappingContent } from "./extras";
import { MainView } from "./Views";

export default function App() {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [uploading, setUploading] = useState(false);

  const [extracting, setExtracting] = useState(false);
  const [extractIdx, setExtractIdx] = useState(0);

  const [generating, setGenerating] = useState(false);
  const [genIdx, setGenIdx] = useState(0);
  const [validationRun, setValidationRun] = useState(false);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
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

  function openDrawer(d: DrawerState) {
    setDrawer(d);
    requestAnimationFrame(() => setDrawerOpen(true));
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setDrawer(null), 200);
  }

  function loadDemoDataset() {
    setRows(buildInitialRows());
    showToast("Dataset demo caricato: 12 posizioni");
  }

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => {
      setRows(buildInitialRows());
      setUploading(false);
      showToast("Portafoglio caricato: 12 posizioni, documenti allegati");
    }, 900);
  }

  function resetAll() {
    setRows([]);
    setExtracting(false);
    setExtractIdx(0);
    setGenerating(false);
    setGenIdx(0);
    setValidationRun(false);
    setDismissed(new Set());
    setExported(false);
    closeDrawer();
  }

  useEffect(() => {
    if (!extracting) return;
    if (extractIdx >= rows.length) {
      setExtracting(false);
      showToast("Estrazione completata su tutte le posizioni");
      return;
    }
    const t = setTimeout(() => {
      setRows((prev) => prev.map((r, i) => (i === extractIdx ? { ...r, baseStatus: "pronto" } : r)));
      setExtractIdx((i) => i + 1);
    }, 240);
    return () => clearTimeout(t);
  }, [extracting, extractIdx, rows.length]);

  function runExtraction() {
    setExtractIdx(0);
    setExtracting(true);
  }

  useEffect(() => {
    if (!generating) return;
    if (genIdx >= rows.length) {
      setGenerating(false);
      setValidationRun(true);
      const issues = computeIssues(rows, dismissed);
      const flagged = Object.values(issues).filter((l) => l.length > 0).length;
      showToast(
        flagged > 0
          ? `Generazione completata — errori × ${flagged} pratiche da validare`
          : "Generazione completata — nessun errore rilevato"
      );
      return;
    }
    const t = setTimeout(() => {
      setRows((prev) =>
        prev.map((r, i) => (i === genIdx ? { ...r, baseStatus: "generato", draftText: generateDraft(r) } : r))
      );
      setGenIdx((i) => i + 1);
    }, 260);
    return () => clearTimeout(t);
  }, [generating, genIdx, rows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function runGeneration() {
    setGenIdx(0);
    setGenerating(true);
  }

  function updateField(id: string, key: keyof PositionFields, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, fields: { ...r.fields, [key]: value } } : r)));
  }

  const issuesMap = useMemo(
    () => (validationRun ? computeIssues(rows, dismissed) : ({} as Record<string, Issue[]>)),
    [rows, dismissed, validationRun]
  );

  const activeBlockers = useMemo(
    () => Object.values(issuesMap).filter((l) => l.length > 0).length,
    [issuesMap]
  );

  function dismissIssue(rowId: string, issueKey: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(rowId + ":" + issueKey);
      return next;
    });
  }

  function derivedStatus(row: PortfolioRow): RowStatus {
    if (row.baseStatus === "esportato") return "esportato";
    if (row.baseStatus === "generato" && validationRun && (issuesMap[row.id] || []).length > 0) return "da-validare";
    return row.baseStatus;
  }

  const allLoaded = rows.length > 0;
  const noneExtracted = allLoaded && rows.every((r) => r.baseStatus === "da-estrarre");
  const allExtracted = allLoaded && rows.every((r) => r.baseStatus !== "da-estrarre");
  const allGenerated = allLoaded && rows.every((r) => r.baseStatus === "generato" || r.baseStatus === "esportato");
  const canExport = allGenerated && validationRun && activeBlockers === 0 && !exported;

  const generatedCount = rows.filter((r) => r.baseStatus === "generato" || r.baseStatus === "esportato").length;
  const totalClaimed = rows.reduce((s, r) => s + (Number(r.fields.importo) || 0), 0);
  const minutesSaved = generatedCount * 12;

  const STEPS = [
    { key: "portafoglio", label: "Portafoglio" },
    { key: "estrazione", label: "Estrazione" },
    { key: "generazione", label: "Generazione" },
    { key: "validazione", label: "Validazione" },
    { key: "esportazione", label: "Esportazione" },
  ];
  let currentStep = 0;
  if (!allLoaded) currentStep = 0;
  else if (noneExtracted || extracting) currentStep = 1;
  else if (allExtracted && !allGenerated) currentStep = 2;
  else if (allGenerated && !exported) currentStep = activeBlockers > 0 ? 3 : 4;
  else if (exported) currentStep = 4;

  function exportPackage() {
    const bundle = rows
      .map((r, i) => `POSIZIONE ${i + 1} — ${r.fields.debitore}\n${"=".repeat(60)}\n\n${r.draftText}`)
      .join("\n\n\n");
    const blob = new Blob([bundle], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lexroom-decreti-ingiuntivi-export.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setRows((prev) => prev.map((r) => ({ ...r, baseStatus: "esportato" })));
    setExported(true);
    showToast(`Pacchetto esportato: ${rows.length} decreti pronti al deposito`);
  }

  async function copyDraft(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Bozza copiata negli appunti");
    } catch {
      showToast("Copia non disponibile in questo ambiente");
    }
  }

  const previewRow = drawer && drawer.type === "preview" ? rows.find((r) => r.id === drawer.id) : null;

  return (
    <MainView
      {...{
      AlertTriangle,
      BRAND,
      CheckCircle2,
      ChevronRight,
      CircleDot,
      ConfDot,
      Copy,
      Download,
      Eye,
      FieldInput,
      FileText,
      LOGO_SRC,
      LayoutTemplate,
      MappingContent,
      MetricCard,
      ProgressLine,
      RotateCcw,
      STEPS,
      Sparkles,
      StatusPill,
      Upload,
      X,
      activeBlockers,
      allExtracted,
      allGenerated,
      allLoaded,
      canExport,
      closeDrawer,
      copyDraft,
      currentStep,
      derivedStatus,
      dismissIssue,
      drawer,
      drawerOpen,
      eur,
      exportPackage,
      exported,
      extractIdx,
      extracting,
      formatMinutes,
      genIdx,
      generatedCount,
      generating,
      issuesMap,
      loadDemoDataset,
      minutesSaved,
      noneExtracted,
      openDrawer,
      previewRow,
      resetAll,
      rows,
      runExtraction,
      runGeneration,
      simulateUpload,
      toast,
      totalClaimed,
      updateField,
      uploading,
      }}
    />
  );
}
