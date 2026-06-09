# Calendz

> Un seul agenda pour toutes tes vies.

Agenda unifié pour les alternants et jeunes pros : il réunit école, boulot et perso
dans une seule vue sans mélanger les contextes. Ce dépôt contient **la landing
(waitlist)** et **l'app calendrier**.

## Fonctionnalités

**Landing (`/`)**
- Page waitlist complète (problème → solution → personas → inscription)
- Formulaire waitlist stocké dans Supabase (anti-doublon, RLS insert-only)

**App calendrier (`/app`, protégée)**
- Authentification email/mot de passe (Supabase Auth)
- Vue semaine avec navigation, 3 sources color-codées (école / boulot / perso)
- Filtres par source
- **Détection automatique des conflits** (créneaux qui se chevauchent surlignés)
- CRUD complet des événements (créer / modifier / supprimer), stockés par utilisateur
- Bouton « semaine d'exemple » pour une démo immédiate

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · React Router · Supabase (Postgres + Auth) · date-fns · lucide-react

## Démarrage rapide

```bash
npm install
cp .env.example .env.local      # remplis les 2 clés Supabase
npm run dev                     # http://localhost:5173
```

Configuration Supabase (table, RLS, auth) et déploiement : voir **[DEPLOYMENT.md](DEPLOYMENT.md)**.
Workflow Git, branches et environnements (dev / main) : voir **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Routes

| Route    | Accès      | Contenu                        |
| -------- | ---------- | ------------------------------ |
| `/`      | Public     | Landing + waitlist             |
| `/login` | Public     | Connexion / création de compte |
| `/app`   | Authentifié | Agenda calendrier              |

## Structure

```
src/
├── pages/        Landing, Login, Dashboard (app)
├── components/   sections landing + calendar/ (WeekView, EventModal)
├── context/      AuthContext (session Supabase)
└── lib/          supabase (client), events (CRUD + conflits), sources
supabase/schema.sql   tables waitlist + events avec RLS
```

© 2026 Calendz
