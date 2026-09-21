import { Copy, X } from "lucide-react";
import { BRAND, docTypeLabel } from "../data/drafts";
import type { PortfolioRow, ReviewStatus, RowStatus } from "../types";
import { StatusPill } from "./status";

export function PreviewDrawer({
  open,
  row,
  derivedStatus,
  onClose,
  onCopy,
  onReview,
}: {
  open: boolean;
  row: PortfolioRow;
  derivedStatus: (row: PortfolioRow) => RowStatus;
  onClose: () => void;
  onCopy: (text: string) => void;
  onReview: (id: string, review: ReviewStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="font-serif text-base text-slate-900">{docTypeLabel(row.docType)}</h3>
            <p className="text-xs text-slate-500">{row.fields.debitore}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <StatusPill status={derivedStatus(row)} />
            <div className="flex gap-2">
              <button
                onClick={() => onCopy(row.draftText)}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:brightness-110"
                style={{ color: BRAND }}
              >
                <Copy className="h-3.5 w-3.5" />
                Copia
              </button>
              <button
                onClick={() => onReview(row.id, "approvato")}
                className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
              >
                Approva
              </button>
              <button
                onClick={() => onReview(row.id, "rifiutato")}
                className="rounded-sm border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800"
              >
                Rifiuta
              </button>
            </div>
          </div>
          <div className="whitespace-pre-wrap rounded border border-slate-300 bg-white p-5 font-serif text-sm leading-relaxed text-slate-800 shadow-inner">
            {row.draftText}
          </div>
        </div>
      </div>
    </div>
  );
}
