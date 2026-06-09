import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

export default function Login() {
  const { signIn, signUp, session, configured } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Déjà connecté -> on file vers l'app
  useEffect(() => {
    if (session) navigate("/app", { replace: true });
  }, [session, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    setBusy(true);
    const { error: err } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);
    setBusy(false);

    if (err) {
      setError(err);
      return;
    }
    if (mode === "signup") {
      // Si la confirmation d'email est activée dans Supabase, pas de session immédiate.
      setInfo(
        "Compte créé. Si la confirmation d'email est activée, valide le lien reçu puis connecte-toi.",
      );
      setMode("signin");
    }
    // En cas de session, le useEffect redirige vers /app.
  }

  return (
    <div className="flex min-h-screen flex-col bg-cloud">
      <div className="container-content py-6">
        <Link to="/" className="flex w-fit items-center gap-2.5" aria-label="Retour à l'accueil">
          <img src="/logo.png" alt="" className="h-8 w-8" width={32} height={32} />
          <span className="text-lg font-extrabold tracking-tight text-deep">Calendz</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-extrabold tracking-tight text-deep">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="mt-1.5 text-sm text-slate">
            Accède à ton agenda unifié Calendz.
          </p>

          {!configured && (
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-coral/10 p-3 text-sm text-deep">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
              <span>
                Supabase n'est pas configuré. Renseigne <code>VITE_SUPABASE_URL</code> et{" "}
                <code>VITE_SUPABASE_ANON_KEY</code> pour activer l'authentification.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
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
                className="mt-2 w-full rounded-xl border border-cloud bg-cloud px-4 py-3 text-anthracite placeholder:text-slate/70 focus:border-sky focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-deep">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-cloud bg-cloud px-4 py-3 text-anthracite placeholder:text-slate/70 focus:border-sky focus:bg-white"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-semibold text-coral">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm font-medium text-deep">{info}</p>
            )}

            <button type="submit" disabled={busy || !configured} className="btn-primary w-full">
              {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
              className="font-bold text-deep underline-offset-4 hover:text-sky hover:underline"
            >
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
