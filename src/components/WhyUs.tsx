import { Users, ShieldCheck, Ban } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Construit par des étudiants, pour des étudiants",
    text: "On vit le problème qu'on résout.",
  },
  {
    icon: ShieldCheck,
    title: "Tes données t'appartiennent",
    text: "Données hébergées dans l'UE, conforme RGPD, jamais revendues.",
  },
  {
    icon: Ban,
    title: "Aucun dark pattern",
    text: "Pas de notifications piégeuses, pas de relances culpabilisantes, pas de bullshit.",
  },
];

export default function WhyUs() {
  return (
    <section id="pourquoi" className="bg-white py-20 sm:py-24">
      <div className="container-content">
        <h2 className="section-title text-center">Pourquoi nous</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky/15 text-deep">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-bold text-deep">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-slate">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
