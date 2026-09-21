import type { RowStatus } from "../types";

export function StatusPill({ status }: { status: RowStatus }) {
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

export function ConfDot({ level }: { level: "alta" | "media" }) {
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

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-serif text-lg text-slate-900">{value}</div>
    </div>
  );
}
