# Calendz — Configuration & déploiement

Stack : **Vite + React + TypeScript + Tailwind + React Router + Supabase**.
Deux parties : landing waitlist (`/`) et app calendrier (`/app`, authentifiée).

## 1. Dev en local

```bash
npm install
cp .env.example .env.local      # puis remplis les 2 clés Supabase
npm run dev                     # http://localhost:5173
```

Sans clés Supabase : la landing s'affiche, mais l'auth et l'agenda sont désactivés
(message clair sur la page de connexion).

## 2. Supabase

### a. Base de données

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → colle [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   Crée les tables `waitlist` et `events` avec leurs politiques RLS.
3. **Settings → API** → récupère `Project URL` et la clé `anon` `public`.

### b. Authentification

- **Authentication → Providers → Email** : activé (par défaut).
- Pour une démo fluide (connexion immédiate après inscription) : **désactive
  « Confirm email »** dans ce même écran. Sinon, l'utilisateur doit valider un lien
  reçu par email avant de pouvoir se connecter.

### c. Variables d'environnement

Dans `.env.local` (local) **et** chez l'hébergeur (prod) :

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Sécurité (RLS)

- `waitlist` : insertion anonyme autorisée, **aucune lecture** côté front (les emails
  ne fuitent pas via l'anon key publique).
- `events` : chaque utilisateur ne peut lire / créer / modifier / supprimer **que ses
  propres événements** (`auth.uid() = user_id`).

## 3. Déploiement (Vercel ou Netlify)

> ⚠️ Les variables `VITE_*` sont **inlinées au build**. Renseigne-les **avant** le build.
> Le routing SPA (`/login`, `/app`) est géré par `vercel.json` (Vercel) et
> `public/_redirects` (Netlify) — déjà inclus.

### Vercel
1. Pousse le repo sur GitHub.
2. [vercel.com](https://vercel.com) → *Add New Project* → importe le repo (preset **Vite**).
3. *Settings → Environment Variables* → ajoute les 2 clés Supabase.
4. *Deploy* → URL type `calendz.vercel.app`.

### Netlify
1. *Add new site → Import from Git* → repo.
2. Build `npm run build`, publish `dist`.
3. *Environment variables* → les 2 clés Supabase.
4. *Deploy*.

## 4. Démo de l'app

1. `/login` → crée un compte → tu arrives sur `/app`.
2. Clique **« Charger une semaine d'exemple »** : 7 événements sont créés, dont un
   **conflit volontaire** le mercredi (TD SQL vs Médecin) → surligné en rouge.
3. Clique un créneau vide pour ajouter, clique un événement pour le modifier/supprimer.

## 5. QR code avec logo

Une fois l'URL de prod connue :

```bash
cd qr-assets
python make_qr.py "https://ton-url-de-prod" qrcode_final.png
```

Dépendances : `pip install "qrcode[pil]" Pillow`.
