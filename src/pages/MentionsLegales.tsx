import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// Mentions légales — valeurs provisoires (éditeur, directeur de publication,
// hébergeur) à valider avant le lancement public.
export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-cloud">
        <div className="container-content flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-7 w-7" width={28} height={28} />
            <span className="text-base font-extrabold tracking-tight text-deep">Calendz</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-slate transition hover:text-deep">
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="container-content max-w-2xl py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-deep">Mentions légales</h1>
        <p className="mt-2 text-sm text-slate">Dernière mise à jour : 9 juin 2026</p>

        <div className="mt-8 space-y-8 leading-relaxed text-slate">
          <section>
            <h2 className="text-lg font-bold text-deep">Éditeur du site</h2>
            <p className="mt-2">
              Ianis Puichaud
              <br />
              Projet étudiant réalisé dans le cadre de la formation SYSOPS à EPSI Nantes,
              sans finalité commerciale.
              <br />
              Contact :{" "}
              <a href="mailto:hello@calendz.app" className="font-semibold text-deep underline">
                hello@calendz.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">Directeur de la publication</h2>
            <p className="mt-2">Ianis Puichaud</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">Hébergement</h2>
            <p className="mt-2">
              Le site est hébergé par Vercel Inc., 340 S Lemon Avenue #4133, Walnut,
              CA 91789, États-Unis. Les données applicatives (base de données et
              authentification) sont gérées par Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">Propriété intellectuelle</h2>
            <p className="mt-2">
              L'ensemble des contenus présents sur ce site (textes, visuels, logo) est la
              propriété de l'éditeur, sauf mention contraire. Toute reproduction sans
              autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">Données personnelles</h2>
            <p className="mt-2">
              Le traitement de tes données personnelles est décrit dans notre{" "}
              <Link to="/confidentialite" className="font-semibold text-deep underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
