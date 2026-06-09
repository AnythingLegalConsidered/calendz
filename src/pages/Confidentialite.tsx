import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// Politique de confidentialité — contenu RGPD de base avec valeurs provisoires
// (responsable, hébergeur, durées) à valider avant le lancement public.
export default function Confidentialite() {
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
        <h1 className="text-3xl font-extrabold tracking-tight text-deep">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-slate">Dernière mise à jour : 9 juin 2026</p>

        <div className="mt-8 space-y-8 leading-relaxed text-slate">
          <section>
            <h2 className="text-lg font-bold text-deep">1. Responsable du traitement</h2>
            <p className="mt-2">
              Le responsable du traitement des données collectées sur Calendz est
              Ianis Puichaud, joignable à l'adresse{" "}
              <a href="mailto:hello@calendz.app" className="font-semibold text-deep underline">
                hello@calendz.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">2. Données collectées</h2>
            <p className="mt-2">Nous collectons uniquement les données suivantes :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-deep">Liste d'attente</strong> : adresse email,
                statut déclaré (alternant, étudiant, etc.) et, de façon facultative, le
                calendrier qui te pose problème.
              </li>
              <li>
                <strong className="text-deep">Compte (app)</strong> : adresse email
                d'authentification. Le mot de passe est géré et chiffré par notre
                sous-traitant Supabase ; nous n'y avons jamais accès en clair.
              </li>
              <li>
                <strong className="text-deep">Événements d'agenda</strong> : titre, source
                (école / boulot / perso) et horaires de début et de fin que tu saisis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">3. Finalités et base légale</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Liste d'attente : te tenir informé du lancement de la beta — base légale :
                ton <strong className="text-deep">consentement</strong>.
              </li>
              <li>
                Compte et événements : te fournir le service d'agenda — base légale :
                l'<strong className="text-deep">exécution du service</strong> que tu demandes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">4. Destinataires et sous-traitants</h2>
            <p className="mt-2">
              Tes données sont hébergées par <strong className="text-deep">Supabase</strong>{" "}
              (base de données et authentification) dans l'Union européenne (Irlande). Le
              site est déployé sur <strong className="text-deep">Vercel</strong> (États-Unis)
              et charge des polices via Google ; ces prestataires impliquent des transferts
              hors de l'Union européenne, encadrés par des clauses contractuelles types. Tes
              données ne sont jamais revendues ni cédées à des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">5. Durée de conservation</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Liste d'attente : jusqu'au lancement de la beta, puis 12 mois,
                sauf désinscription anticipée.
              </li>
              <li>Compte et événements : jusqu'à la suppression de ton compte.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">6. Cookies et services tiers</h2>
            <p className="mt-2">
              Calendz n'utilise pas de cookies de suivi publicitaire. Le site charge des
              polices via Google Fonts, ce qui implique la transmission de ton adresse IP
              aux serveurs de Google lors du chargement des pages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-deep">7. Tes droits</h2>
            <p className="mt-2">
              Conformément au RGPD, tu disposes d'un droit d'accès, de rectification,
              d'effacement, d'opposition et de portabilité de tes données. Pour les
              exercer, écris à{" "}
              <a href="mailto:hello@calendz.app" className="font-semibold text-deep underline">
                hello@calendz.app
              </a>
              . Tu peux également introduire une réclamation auprès de la CNIL
              (www.cnil.fr).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
