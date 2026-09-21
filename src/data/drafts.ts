import type { DocTypeId, PortfolioRow } from "../types";

export const BRAND = "#0F4C9D";

export const BOOKING_URL = "https://calendar.app.google/3cosca92hVUF1yUF8";

export const LANDING_HOOK =
  "Fabbrica legale per NPL e debt collection: carica il portafoglio, genera le bozze, revisiona e esporta.";

export const DOC_TYPES: {
  id: DocTypeId;
  label: string;
  short: string;
  beat: string;
}[] = [
  {
    id: "messa-in-mora",
    label: "Messa in mora",
    short: "Messa in mora",
    beat: "Diffida ad adempiere sul credito insoluto: termine, importo, riserva di azione.",
  },
  {
    id: "piano-di-pagamento",
    label: "Piano di pagamento",
    short: "Piano di pagamento",
    beat: "Proposta di piano rateale, con condizioni di accoglimento e decadenza.",
  },
  {
    id: "decreto",
    label: "Decreto ingiuntivo",
    short: "Decreto",
    beat: "Bozza di ricorso monitorio (artt. 633 e ss. c.p.c.) da far revisionare al legale.",
  },
];

export const eur = (n: number | string) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    Number(n) || 0,
  );

function installmentCount(amount: number) {
  if (amount <= 0) return 6;
  if (amount < 5000) return 6;
  if (amount < 25000) return 12;
  if (amount < 80000) return 18;
  return 24;
}

function missing(value: string, fallback: string) {
  const v = (value || "").trim();
  return v ? v : fallback;
}

function draftFooter(creditore: string) {
  return `Luogo e data, ________________

${creditore}
[firme / procura da apporre in revisione]

— Bozza generata da Lexroom. Non rivista da un professionista abilitato. Da approvare prima dell'esportazione. —`;
}

function generateMessaInMora(row: PortfolioRow) {
  const f = row.fields;
  const creditore = missing(f.creditore, "[creditore]");
  const debitore = missing(f.debitore, "[debitore]");
  const cf = missing(f.cf, "[C.F. / P.IVA non indicato]");
  const titolo = missing(f.tipoTitolo, "rapporto obbligatorio non meglio specificato");
  const contratto = missing(f.contrattoN, "[n. contratto non indicato]");
  const docsList = row.docs.length ? row.docs.join(", ") : "documentazione a supporto del credito";

  return `RACCOMANDATA A.R. / PEC
${creditore}

Spett.le
${debitore}
C.F. / P.IVA ${cf}

Oggetto: messa in mora e diffida ad adempiere — pratica ${contratto}

Con la presente, in qualità di creditore / servicer incaricato della gestione del credito, Vi si intimano formalmente, ai sensi e per gli effetti dell'art. 1219 c.c., il pagamento dell'importo di ${eur(f.importo)}, oltre interessi di mora e spese, derivante da ${titolo} n. ${contratto}, scaduto in data ${missing(f.scadenza, "[data non indicata]")} e rimasto insoluto.

Il credito è certo, liquido ed esigibile. A supporto si richiamano: ${docsList}.

Vi si assegna il termine perentorio di quindici (15) giorni dal ricevimento della presente per il pagamento integrale, a mezzo bonifico alle coordinate che Vi saranno comunicate dal gestore della pratica, ovvero per far pervenire proposta scritta di definizione.

Decorso inutilmente il termine, il creditore si riserva ogni azione, anche monitoria e cautelare, ivi compresa la proposizione di ricorso per decreto ingiuntivo, con aggravio di spese, interessi e oneri di procedura, senza ulteriore avviso.

La presente vale quale atto interruttivo della prescrizione.

${f.note ? `Note pratica: ${f.note}\n\n` : ""}${draftFooter(creditore)}`;
}

function generatePiano(row: PortfolioRow) {
  const f = row.fields;
  const creditore = missing(f.creditore, "[creditore]");
  const debitore = missing(f.debitore, "[debitore]");
  const cf = missing(f.cf, "[C.F. / P.IVA non indicato]");
  const titolo = missing(f.tipoTitolo, "rapporto obbligatorio");
  const contratto = missing(f.contrattoN, "[n. contratto non indicato]");
  const amount = Number(f.importo) || 0;
  const nRate = installmentCount(amount);
  const rata = amount > 0 ? Math.round(amount / nRate) : 0;
  const last = amount > 0 ? amount - rata * (nRate - 1) : 0;

  return `PROPOSTA DI PIANO DI PAGAMENTO
(piano di rientro stragiudiziale)

Creditore / gestore: ${creditore}
Debitore: ${debitore}, C.F. / P.IVA ${cf}
Posizione: ${contratto} — ${titolo}
Importo complessivo dovuto: ${eur(f.importo)} (oltre interessi e spese, se dovuti)
Scadenza originaria: ${missing(f.scadenza, "[non indicata]")}

1. Oggetto
Il creditore, in via puramente transattiva e senza riconoscimento alcuno di eccezioni, propone al debitore un piano di pagamento rateale del credito insoluto, alle condizioni che seguono.

2. Piano
- Numero rate: ${nRate} mensili consecutive
- Importo rata ordinaria: ${eur(rata)}
- Importo ultima rata di conguaglio: ${eur(last)}
- Decorrenza: prima rata entro 15 giorni dall'accettazione scritta; rate successive il medesimo giorno di ciascun mese
- Modalità: bonifico con causale «piano ${contratto} — rata n. __»

3. Condizioni
L'accettazione del piano non costituisce novazione, rinuncia al credito o transazione definitiva sino al puntuale adempimento dell'ultima rata. I pagamenti si imputano prima a spese, poi a interessi, poi a capitale.

4. Decadenza
Il mancato pagamento, in tutto o in parte, di anche una sola rata nel termine pattuito, o il rifiuto di sottoscrivere la presente, determina la decadenza dal beneficio del termine. L'intero residuo diviene immediatamente esigibile e il creditore potrà agire per il recupero, ivi inclusa la messa in mora e l'azione monitoria.

5. Accettazione
Il debitore, per accettazione, restituisce copia sottoscritta della presente entro dieci (10) giorni, unitamente alla prova del versamento della prima rata. In mancanza la proposta si intende revocata.

${f.note ? `Note pratica: ${f.note}\n\n` : ""}${draftFooter(creditore)}`;
}

function generateDecreto(row: PortfolioRow) {
  const f = row.fields;
  const creditore = missing(f.creditore, "[creditore]");
  const debitore = missing(f.debitore, "[debitore]");
  const cf = missing(f.cf, "[dato mancante]");
  const tribunale = f.tribunale ? f.tribunale.toUpperCase() : "[TRIBUNALE NON INDICATO]";
  const titolo = missing(f.tipoTitolo, "[titolo non indicato]");
  const contratto = missing(f.contrattoN, "[n. non indicato]");
  const docsList = row.docs.length ? row.docs.join(", ") : "documentazione a supporto del credito";

  return `TRIBUNALE DI ${tribunale}

RICORSO PER DECRETO INGIUNTIVO
(artt. 633 e ss. c.p.c.)
— BOZZA PER REVISIONE DEL LEGALE —

PARTI
Ricorrente: ${creditore}, in persona del legale rappresentante pro tempore.
Intimato/a: ${debitore}, C.F. / P.IVA ${cf}.

FATTO
Il/la ricorrente vanta un credito certo, liquido ed esigibile nei confronti dell'intimato/a, derivante da ${titolo} n. ${contratto}, per l'importo di ${eur(f.importo)}, scaduto in data ${missing(f.scadenza, "[data non indicata]")} e rimasto insoluto nonostante le richieste di pagamento formulate in via stragiudiziale.

PROVA SCRITTA
A sostegno del credito si producono: ${docsList}, atti idonei a costituire prova scritta del credito ai sensi e per gli effetti dell'art. 633 c.p.c.

DOMANDA
Si chiede che l'Ill.mo Tribunale adito voglia ingiungere all'intimato/a il pagamento della somma di ${eur(f.importo)}, oltre interessi legali dalla data di scadenza al saldo effettivo, e delle spese della procedura monitoria.

CONCLUSIONI
Piaccia all'Ill.mo Tribunale pronunciare decreto ingiuntivo, anche provvisoriamente esecutivo ove ne ricorrano i presupposti di cui all'art. 642 c.p.c., per l'importo sopra indicato, oltre interessi e spese, con fissazione del termine per l'eventuale opposizione.

${f.note ? `Note pratica: ${f.note}\n\n` : ""}${draftFooter(creditore)}`;
}

export function generateDraft(row: PortfolioRow, docType: DocTypeId) {
  if (docType === "messa-in-mora") return generateMessaInMora(row);
  if (docType === "piano-di-pagamento") return generatePiano(row);
  return generateDecreto(row);
}

export function docTypeLabel(id: DocTypeId | null) {
  if (!id) return "Bozza";
  return DOC_TYPES.find((d) => d.id === id)?.label ?? "Bozza";
}

export function exportFileName(docType: DocTypeId | null, count: number) {
  const slug =
    docType === "messa-in-mora"
      ? "messe-in-mora"
      : docType === "piano-di-pagamento"
        ? "piani-di-pagamento"
        : "decreti-ingiuntivi";
  return `lexroom-${slug}-${count}-bozze.md`;
}
