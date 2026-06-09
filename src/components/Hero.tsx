import CalendarMerge from "./CalendarMerge";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-content grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="eyebrow mb-4">L'agenda des alternants &amp; jeunes pros</p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-deep sm:text-5xl lg:text-6xl">
            Un seul agenda pour toutes tes vies.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
            Calendz synchronise Google, Outlook et iCloud sans mélanger ton école,
            ton boulot et ton perso. L'agenda intelligent pensé pour les alternants
            et les jeunes pros.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#waitlist" className="btn-primary">
              Rejoindre la waitlist
            </a>
            <a href="#solution" className="link-secondary">
              Voir comment ça marche
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CalendarMerge />
        </div>
      </div>
    </section>
  );
}
