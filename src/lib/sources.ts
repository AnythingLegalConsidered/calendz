// Les trois "mondes" color-codés de Calendz.
// Classes Tailwind écrites en toutes lettres pour que le compilateur les garde.

export type EventSource = "ecole" | "boulot" | "perso";

export interface SourceMeta {
  label: string;
  dot: string; // pastille de légende
  block: string; // bloc d'événement dans le calendrier
  swatch: string; // fond clair pour les filtres actifs
}

export const SOURCES: Record<EventSource, SourceMeta> = {
  ecole: {
    label: "École",
    dot: "bg-deep",
    block: "bg-deep text-white",
    swatch: "bg-deep/10 text-deep border-deep",
  },
  boulot: {
    label: "Boulot",
    dot: "bg-sky",
    block: "bg-sky text-deep",
    swatch: "bg-sky/15 text-deep border-sky",
  },
  perso: {
    label: "Perso",
    dot: "bg-coral",
    block: "bg-coral text-deep",
    swatch: "bg-coral/15 text-deep border-coral",
  },
};

export const SOURCE_KEYS = Object.keys(SOURCES) as EventSource[];
