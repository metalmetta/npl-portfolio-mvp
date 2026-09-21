# npl-portfolio-mvp

Landing Lexroom per una fabbrica legale NPL / debt collection: carica un portafoglio, genera bozze (messa in mora, piano di pagamento, decreto), revisiona e esporta.

Demo client-side (nessun backend). Il dataset demo apre 12 posizioni già compilate, con bozze dei tre tipi di atto pronte alla revisione umana.

## Prerequisites

- Node.js 20+ (Node 22 is fine)
- npm

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Apri l'URL stampato dal terminale (in genere `http://localhost:5173`).

## Build

```bash
npm run build
```

```bash
npm run preview
```

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- lucide-react
