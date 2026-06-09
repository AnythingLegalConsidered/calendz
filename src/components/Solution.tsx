import { Columns3, BellRing, Sparkles } from "lucide-react";

const features = [
  {
    icon: Columns3,
    title: "Une vue unifiée, sans mélanger les contextes",
    text: "Tes trois mondes côte à côte, chacun avec sa couleur, son contexte, ses règles.",
    soon: false,
  },
  {
    icon: BellRing,
    title: "Détection automatique des conflits",
    text: "On t'alerte avant que tu poses un meeting pendant ton TD.",
    soon: false,
  },
  {
    icon: Sparkles,
    title: "L'IA qui protège ton temps",
    text: "Suggestions de créneaux, protection des blocs de deep work, parsing des emails.",
    soon: true,
  },
];

export default function Solution() {
  return (
    <section id="solution" className="bg-white py-20 sm:py-24">
      <div className="container-content">
        <h2 className="section-title text-center">Comment Calendz résout ça</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, soon }) => (
            <div key={title} className="card flex flex-col">
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky/15 text-deep">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                {soon && (
                  <span className="rounded-full bg-deep px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Bientôt
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-lg font-bold text-deep">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
