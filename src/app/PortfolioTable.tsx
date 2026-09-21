import { Eye } from "lucide-react";
import { BRAND, DOC_TYPES } from "../data/drafts";
import type { DocTypeId, PortfolioRow, PositionFields } from "../types";
import { StatusPill, ConfDot, FieldInput } from "./status";

export function PortfolioTable({
  rows,
  derivedStatus,
  changeRowType,
  updateField,
  openDrawer,
  setReview,
}: {
  rows: PortfolioRow[];
  derivedStatus: (row: PortfolioRow) => import("../types").RowStatus;
  changeRowType: (id: string, docType: DocTypeId) => void;
  updateField: (id: string, key: keyof PositionFields, value: string) => void;
  openDrawer: (id: string) => void;
  setReview: (id: string, review: import("../types").ReviewStatus) => void;
}) {
  return (
    <div className="rounded border border-slate-200 bg-white">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
            <th className="px-1.5 py-2 font-medium">Stato</th>
            <th className="px-1.5 py-2 font-medium">Tipo atto</th>
            <th className="px-1.5 py-2 font-medium">Debitore</th>
            <th className="px-1.5 py-2 font-medium">CF / P.IVA</th>
            <th className="px-1.5 py-2 font-medium">Creditore</th>
            <th className="px-1.5 py-2 font-medium">Importo</th>
            <th className="px-1.5 py-2 font-medium">Scadenza</th>
            <th className="px-1.5 py-2 font-medium">Titolo credito</th>
            <th className="px-1.5 py-2 font-medium">Tribunale</th>
            <th className="px-1.5 py-2 font-medium">Revisione</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const status = derivedStatus(r);
            return (
              <tr key={r.id} className="border-b border-slate-100 align-top hover:bg-slate-50/60">
                <td className="px-1.5 py-2">
                  <StatusPill status={status} />
                </td>
                <td className="px-1.5 py-2">
                  <select
                    value={r.docType ?? ""}
                    onChange={(e) => changeRowType(r.id, e.target.value as DocTypeId)}
                    className="w-full max-w-full rounded-sm border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-800"
                  >
                    {DOC_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.short}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1.5 py-2">
                  <span className="flex min-w-0 items-center text-xs text-slate-800">
                    <span className="truncate">{r.fields.debitore}</span>
                    <ConfDot level={r.conf.debitore} />
                  </span>
                </td>
                <td className="px-1.5 py-2">
                  <FieldInput
                    value={r.fields.cf}
                    onChange={(v) => updateField(r.id, "cf", v)}
                    mono
                    placeholder="mancante"
                  />
                </td>
                <td className="px-1.5 py-2 text-xs text-slate-600 truncate">{r.fields.creditore}</td>
                <td className="px-1.5 py-2">
                  <span className="flex items-center text-sm">
                    <FieldInput
                      value={r.fields.importo}
                      onChange={(v) => updateField(r.id, "importo", v.replace(/[^0-9]/g, ""))}
                    />
                    <ConfDot level={r.conf.importo} />
                  </span>
                </td>
                <td className="px-1.5 py-2">
                  <span className="flex items-center text-sm text-slate-700">
                    {r.fields.scadenza}
                    <ConfDot level={r.conf.scadenza} />
                  </span>
                </td>
                <td className="px-1.5 py-2">
                  <FieldInput
                    value={r.fields.tipoTitolo}
                    onChange={(v) => updateField(r.id, "tipoTitolo", v)}
                    placeholder="assente"
                  />
                </td>
                <td className="px-1.5 py-2">
                  <span className="flex items-center text-sm">
                    <FieldInput
                      value={r.fields.tribunale}
                      onChange={(v) => updateField(r.id, "tribunale", v)}
                      placeholder="non indicato"
                    />
                    <ConfDot level={r.conf.tribunale} />
                  </span>
                </td>
                <td className="px-1.5 py-2">
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
  );
}
