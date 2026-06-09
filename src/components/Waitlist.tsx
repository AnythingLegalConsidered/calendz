import { useState, type FormEvent } from "react";
import { PartyPopper, Loader2 } from "lucide-react";
import { joinWaitlist, type WaitlistStatus } from "../lib/supabase";

const STATUSES: WaitlistStatus[] = [
  "Alternant",
  "Étudiant",
  "Jeune diplômé / actif",
  "Autre",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistStatus | "">("");
  const [painPoint, setPainPoint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email)) {
      setError("Entre une adresse email valide.");
      return;
    }
    if (!status) {
      setError("Indique ton statut.");
      return;
    }

    setSubmitting(true);
    const result = await joinWaitlist({ email, status, pain_point: painPoint });
    setSubmitting(false);

    if (result.ok || result.reason === "duplicate") {
      // Doublon = déjà inscrit : on remercie quand même côté UX.
      setDone(true);
      return;
    }
    setError(result.message);
  }

  return (
    <section id="waitlist" className="scroll-mt-16 bg-deep py-20 sm:py-24">
      <div className="container-content max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Sois parmi les premiers à tester Calendz
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-sky">
            On lance la beta privée à la rentrée 2026. Les inscrits sur la waitlist
            y accèdent en priorité, gratuitement à vie pour les alternants.
          </p>
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 shadow-soft sm:p-8">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky/15 text-deep">
                <PartyPopper className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-5 max-w-md text-lg font-semibold text-deep">
                Merci ! On te recontacte dès qu'on ouvre la beta. En attendant,
                parle de Calendz autour de toi 👋
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-deep">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom@exemple.fr"
                  aria-invalid={error?.includes("email") ? true : undefined}
                  className="mt-2 w-full rounded-xl border border-cloud bg-cloud px-4 py-3 text-anthracite placeholder:text-slate/70 focus:border-sky focus:bg-white"
                />
              </div>

              {/* Statut */}
              <fieldset>
                <legend className="text-sm font-bold text-deep">Ton statut</legend>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {STATUSES.map((s) => {
                    const checked = status === s;
                    return (
                      <label
                        key={s}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          checked
                            ? "border-coral bg-coral/10 text-deep"
                            : "border-cloud bg-white text-slate hover:border-sky"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={checked}
                          onChange={() => setStatus(s)}
                          className="h-4 w-4 accent-coral"
                        />
                        {s}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Pain point (optionnel) */}
              <div>
                <label htmlFor="pain" className="block text-sm font-bold text-deep">
                  Quel est le calendrier qui te pourrit le plus la vie ?{" "}
                  <span className="font-medium text-slate">(optionnel)</span>
                </label>
                <input
                  id="pain"
                  type="text"
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  maxLength={140}
                  placeholder="Outlook du boulot, sans hésiter…"
                  className="mt-2 w-full rounded-xl border border-cloud bg-cloud px-4 py-3 text-anthracite placeholder:text-slate/70 focus:border-sky focus:bg-white"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-semibold text-coral">
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {submitting ? "Un instant…" : "Je rejoins la waitlist"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
