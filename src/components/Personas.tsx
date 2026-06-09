import { GraduationCap, Briefcase } from "lucide-react";

const personas = [
  {
    icon: GraduationCap,
    title: "Tu es en alternance",
    text: "École + entreprise + perso, trois écosystèmes différents. Calendz est gratuit pour les étudiants.",
  },
  {
    icon: Briefcase,
    title: "Tu démarres ta carrière",
    text: "Tu sors d'alternance, tu veux enfin être organisé sans y passer ta vie. L'offre Pro est faite pour toi.",
  },
];

export default function Personas() {
  return (
    <section id="pour-qui" className="bg-cloud py-20 sm:py-24">
      <div className="container-content">
        <h2 className="section-title text-center">Pour qui ?</h2>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {personas.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-deep text-white">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-deep">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
