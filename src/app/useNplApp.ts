import { useEffect, useRef, useState } from "react";
import {
  docTypeLabel,
  exportFileName,
  generateDraft,
} from "../data/drafts";
import type { DocTypeId, PortfolioRow, PositionFields, ReviewStatus, RowStatus } from "../types";
import { MIXED_TYPES, hydrateBook } from "./hydrate";

type DrawerState = { type: "preview"; id: string };

export function useNplApp() {
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
    showToast("Dataset demo: 12 posizioni, campi popolati, 12 bozze già approvate — Esporta pronto");
  }

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => {
      setRows(hydrateBook("mixed"));
      setUploading(false);
      setExported(false);
      showToast("Portafoglio caricato: 12 posizioni con bozze già approvate — Esporta pronto");
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

  function approveAll() {
    setRows((prev) =>
      prev.map((r) =>
        r.draftText ? { ...r, review: "approvato" as ReviewStatus, baseStatus: "generato" as const } : r,
      ),
    );
    setExported(false);
    showToast("Tutte le bozze approvate — Esporta pronto");
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
        return (
          "POSIZIONE " +
          (i + 1) +
          " — " +
          r.fields.debitore +
          " — " +
          tipo +
          "\n" +
          "=".repeat(64) +
          "\n\n" +
          r.draftText
        );
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

  return {
    rows, uploading, generating, genIdx, pendingType, bulkType, setBulkType, exported, drawer, drawerOpen, toast,
    showToast, openDrawer, closeDrawer, loadDemoDataset, simulateUpload, resetAll, regenerateAll,
    updateField, changeRowType, setReview, approveAll, derivedStatus,
    allLoaded, generatedCount, pendingReview, approvedCount, rejectedCount, canExport, totalClaimed, STEPS, currentStep,
    exportPackage, copyDraft, previewRow,
  };
}
