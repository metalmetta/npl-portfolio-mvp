import { BRAND } from "./data";

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-serif text-lg text-slate-900">{value}</div>
    </div>
  );
}

export function ProgressLine({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 text-sm text-slate-600">{label}</div>
      <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-amber-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MappingContent() {
  const rows = [
    { section: "Parti", fields: "{{creditore}}, {{debitore}}, {{cf}}" },
    { section: "Fatti", fields: "{{tipoTitolo}}, {{contrattoN}}, {{importo}}, {{scadenza}}" },
    { section: "Prova scritta", fields: "{{docs}}" },
    { section: "Domanda", fields: "{{importo}}" },
    { section: "Conclusioni", fields: "testo di rito, nessun dato dinamico" },
  ];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">
        Il template del decreto ingiuntivo è fisso: cambiano solo i placeholder popolati dai dati estratti.
      </p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.section} className="rounded border border-slate-200 px-3 py-2">
            <div className="text-sm font-medium text-slate-800">{r.section}</div>
            <div className="mt-0.5 font-mono text-xs" style={{ color: BRAND }}>{r.fields}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
