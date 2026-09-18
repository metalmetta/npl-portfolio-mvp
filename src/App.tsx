import { useState } from "react";
const BRAND = "#0F4C9D";
export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <img src="/favicon.svg" alt="Lexroom" className="h-6 w-auto" />
          <h1 className="font-serif text-xl">Decreti NPL — MVP bulk</h1>
        </div>
      </div>
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h2 className="font-serif text-lg">1 cartella → n decreti pronti al deposito</h2>
        <p className="mt-2 text-sm text-slate-500">Demo NPL Lexroom — sync completo in corso.</p>
        <button onClick={() => setReady(true)} className="mt-6 rounded-sm px-4 py-2.5 text-sm font-medium text-white" style={{ backgroundColor: BRAND }}>
          {ready ? "Dataset pronto" : "Carica portafoglio NPL"}
        </button>
      </div>
    </div>
  );
}
