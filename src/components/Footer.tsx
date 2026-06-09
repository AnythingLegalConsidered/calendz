import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-cloud bg-white py-12">
      <div className="container-content flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-7 w-7" width={28} height={28} />
            <span className="text-base font-extrabold tracking-tight text-deep">Calendz</span>
          </div>
          <p className="mt-3 text-sm text-slate">Un seul agenda pour toutes tes vies.</p>
        </div>

        <nav aria-label="Liens de pied de page">
          <ul className="flex flex-col gap-2 text-sm text-slate sm:items-end">
            <li>
              <Link to="/mentions-legales" className="transition hover:text-deep">Mentions légales</Link>
            </li>
            <li>
              <Link to="/confidentialite" className="transition hover:text-deep">Politique de confidentialité</Link>
            </li>
            <li>
              <a href="mailto:hello@calendz.app" className="transition hover:text-deep">Contact</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container-content mt-8">
        <p className="text-sm text-slate">© 2026 Calendz</p>
      </div>
    </footer>
  );
}
