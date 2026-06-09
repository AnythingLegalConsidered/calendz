import { Link } from "react-router-dom";

/** En-tête minimal et sticky : logo + accès app + CTA waitlist. */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cloud/80 bg-white/85 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Calendz, accueil">
          <img src="/logo.png" alt="" className="h-8 w-8" width={32} height={32} />
          <span className="text-lg font-extrabold tracking-tight text-deep">Calendz</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/login"
            className="text-sm font-semibold text-deep transition hover:text-sky"
          >
            Connexion
          </Link>
          <a href="#waitlist" className="btn-primary px-5 py-2.5 text-sm">
            Rejoindre la waitlist
          </a>
        </div>
      </div>
    </header>
  );
}
