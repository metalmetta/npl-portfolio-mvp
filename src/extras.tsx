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

export function WhyContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-600">
      <div>
        <div className="mb-1 text-xs font-medium text-slate-400">Segnale di closed-lost</div>
        <p>
          Cerved Credit Solutions e Prelios si sono fermate in trattativa: Lexroom era troppo lento sui decreti
          ingiuntivi ad alto volume. Harvey copre già questo caso d'uso.
        </p>
      </div>
      <div>
        <div className="mb-1 text-xs font-medium text-slate-400">Mercato</div>
        <p>
          Circa 3.000 avvocati italiani lavorano in ambito NPL / gestione crediti, distribuiti su 8 hub servicer
          principali (doValue, Cerved, Prelios, Intrum, AMCO, Guber, Banca Ifis, illimity) e ampie reti di studi
          esterni.
        </p>
      </div>
      <div>
        <div className="mb-1 text-xs font-medium text-slate-400">Perché è un caso AI pulito</div>
        <p>
          Il decreto ingiuntivo è un atto documentale, senza udienza: la struttura si ripete identica su migliaia
          di posizioni, cambiano solo i dati.
        </p>
      </div>
      <div>
        <div className="mb-1 text-xs font-medium text-slate-400">Obiettivo del demo</div>
        <p>
          Dimostrare che da una cartella di portafoglio si arriva a n bozze pronte in un'unica sessione, con un
          controllo di validazione prima dell'esportazione.
        </p>
      </div>
      <div className="border-t border-slate-100 pt-3 text-xs text-slate-400">
        Fuori scope per questo MVP: OCR reale, parsing PDF, PEC/deposito telematico, autenticazione, persistenza.
        Prossimo passo naturale: estendere lo stesso motore al juicio monitorio (Spagna) e all'injonction de
        payer (Francia).
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
