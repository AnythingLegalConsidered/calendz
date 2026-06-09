import { Unlink, CalendarClock, EyeOff } from "lucide-react";

const items = [
  {
    icon: Unlink,
    title: "Trois agendas qui ne se parlent pas",
    text: "Google pour l'école, Outlook pour le taf, iCloud pour le perso. Aucun ne voit les autres.",
  },
  {
    icon: CalendarClock,
    title: "Du double-booking permanent",
    text: "Une réunion client posée pendant ton cours, un rendez-vous médecin oublié.",
  },
  {
    icon: EyeOff,
    title: "Du stress, pas de visibilité",
    text: "Tu passes ta semaine à recopier des créneaux d'un agenda à l'autre.",
  },
];

export default function Problem() {
  return (
    <section id="probleme" className="bg-cloud py-20 sm:py-24">
      <div className="container-content">
        <h2 className="section-title text-center">Tu te reconnais ?</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-coral/15 text-coral">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-deep">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
