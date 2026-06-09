# Contribuer à Calendz

Workflow Git, environnements et règles de déploiement. Projet **solo** — workflow
volontairement léger, mais `main` reste protégée car c'est la production.

## Branches

| Branche      | Rôle                                  | Déploiement Vercel                       |
| ------------ | ------------------------------------- | ---------------------------------------- |
| `main`       | **Production**                        | Production (domaine de prod)             |
| `dev`        | **Staging** — terrain de test continu | Preview stable `calendz-git-dev-…`       |
| `feature/*`  | (optionnel) gros chantier risqué      | Preview jetable, une par PR              |

On ne pousse **jamais** directement sur `main`. Tout passe par `dev`.

## Environnements & URLs

Vercel expose deux types d'URL — c'est la clé du setup :

- **Staging** ← `dev` : URL **stable** `calendz-git-dev-<scope>.vercel.app` (récupère
  l'exacte dans Vercel → Deployments après le 1er build de `dev`). Elle ne change pas
  et suit toujours le dernier commit de `dev`. C'est ici qu'on teste avant de release.
- **Preview jetable** ← chaque PR : URL hashée unique, pratique pour faire relire une
  feature isolée.
- **Production** ← `main` : le domaine public, ne bouge que sur release.

> ⚠️ **Base Supabase partagée.** `dev` et `main` tapent la **même** base. Donc :
> - Les inscriptions / comptes créés en test sur staging atterrissent dans la **vraie**
>   base → utilise des emails identifiables (`toi+test@…`) et nettoie après.
> - **Aucune migration destructive** (`DROP`, `DROP COLUMN`, `NOT NULL` rétroactif) sans
>   avoir conscience que la prod la subit immédiatement. Privilégie les changements
>   additifs.

## Cycle de travail (solo)

```bash
# 1. bosser sur dev
git switch dev
# ... code ...
git add <fichiers>
git commit -m "feat: ..."
git push                 # → staging se met à jour, la CI build

# 2. tester sur l'URL staging (calendz-git-dev-…)

# 3. release en prod quand c'est bon
#    → ouvrir une PR dev → main sur GitHub
#    → la CI doit être verte
#    → merge → la prod se déploie
```

Pour un chantier risqué qu'on ne veut pas exposer tout de suite sur le staging :
`git switch -c feature/x` depuis `dev`, puis PR `feature/x → dev`.

## Intégration continue (CI)

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) lance `npm ci && npm run build`
(`tsc --noEmit` + `vite build`) :

- à chaque **push sur `dev`** — attrape les erreurs tôt ;
- à chaque **PR vers `main`** — gate avant release.

C'est le seul garde-fou réel contre le merge en prod de code qui ne compile pas. Pour
le rendre **bloquant**, active la branch protection sur `main`
(GitHub → Settings → Branches → *require status check* = `build`).

## Config & déploiement détaillés

Supabase, RLS, variables d'environnement, Vercel/Netlify : voir
**[DEPLOYMENT.md](DEPLOYMENT.md)**.
