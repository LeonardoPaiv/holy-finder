# Mapa da Fé

**English** · [Português](README.pt-BR.md)

A map-based finder for religious institutions, with a geolocated community feed, a dashboard for each institution, and a moderation system.

Built with Next.js 14 (App Router) · TypeScript · MongoDB · Supabase · Leaflet

> Brazil-focused product with a Portuguese-language UI. Signup validates a **CNPJ** (the Brazilian company tax ID).

---

## About

Mapa da Fé ("Map of Faith") connects people to nearby places of worship — churches, temples, *terreiros*, synagogues, and mosques. Users open the map, filter by religion, and find what is close by, along with service times, events, and contact details.

On the other side, each institution manages its own page: details, location, cover image, schedule, and feed posts. A moderation layer keeps the content in check.

The app covers **8 religious traditions** — Católica, Evangélica, Espírita, Matriz Africana, Judaica, Budista, Muçulmana, and Outras — each with its own color identity on the map.

## Features

### For people looking for a place of worship

- **Interactive map** with radius search and religion filter ("search this area")
- **Find the nearest** using the device's geolocation
- **Institution page** with service times, events, phone, address, and a direct Google Maps link
- **Community feed** with posts from nearby institutions, sorted by proximity, with infinite scroll
- **Post reporting** for inappropriate content
- **Donations** and transaction history *(behind a feature flag)*

### For institutions

- Signup with CNPJ validation and hCaptcha
- Dashboard to edit core details, map location, cover image, and schedule
- Feed publishing with **automatic image moderation** before a post goes live
- Management of linked users and ownership transfer

### For moderators

- Moderation panel for institutions, posts, reports, and users
- Post suspension, user banning, and role changes
- Report workflow with states (pending / solved / rejected)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose (`2dsphere` geospatial indexes) |
| Auth & Storage | Supabase |
| Maps | Leaflet + react-leaflet |
| Server state | TanStack Query |
| Anti-bot | hCaptcha |
| Image moderation | Sightengine |
| Ads | Google AdSense *(behind a feature flag)* |

## Architecture

The backend is split into layers, each with a single responsibility:

```
Route Handler  ->  Service       ->  Repository        ->  Model
(app/api/*)        (lib/services)    (lib/repositories)    (lib/models)
 HTTP + auth       business logic    data access           Mongoose schema
```

Every authenticated route goes through `verifyAuth` (`lib/apiUtils.ts`), which validates the Supabase token on the server and checks the user's type, role, and banned status.

On the frontend, screens follow an **MVVM** pattern: components handle presentation while view models (`components/viewmodels/`) hold the logic, supported by contexts and custom hooks.

Proximity search uses MongoDB's native geospatial queries — `$near` for institutions and a `$geoNear` aggregation pipeline for the feed.

### Project structure

```
app/            App Router routes
  api/          Route handlers (REST)
  institution/  Institution's logged-in area + moderation panel
components/     UI components, contexts, and view models
lib/
  models/       Mongoose schemas
  repositories/ Data access
  services/     Business logic
  apiUtils.ts   verifyAuth and route validation
hooks/          UI and data-fetching hooks
services/       API clients consumed by the frontend
utils/          Helpers (map, colors, phone, sharing)
```

## Running locally

**Prerequisites:** Node.js `24.11.1` (see `.nvmrc`), a MongoDB instance, and a Supabase project.

```bash
nvm use              # optional, respects .nvmrc
npm install
cp .env.example .env.local
# fill in the values in .env.local
npm run dev
```

The app starts at `http://localhost:3000`.

### Environment variables

Copy `.env.example` to `.env.local` and fill it in. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser — **never** use that prefix for a secret.

| Variable | Scope | Description |
|---|---|---|
| `MONGODB_URI` | server | MongoDB connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | **server** | Service role key — bypasses RLS, never expose |
| `NEXT_PUBLIC_BUCKET_NAME` | public | Storage bucket for images |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | public | hCaptcha site key |
| `NEXT_PUBLIC_APP_URL` | public | Base URL of the app |
| `MODERATION_PROVIDER` | server | Moderation provider (`sightengine`) |
| `SIGHTENGINE_API_USER` | server | Sightengine API user |
| `SIGHTENGINE_API_SECRET` | server | Sightengine API secret |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | public | AdSense publisher ID |
| `NEXT_PUBLIC_GOOGLE_AD_SLOT` | public | Ad slot (`auto` for automatic ads) |
| `NEXT_PUBLIC_ENABLE_DONATIONS` | public | Feature flag: donations button |
| `NEXT_PUBLIC_ENABLE_ADS` | public | Feature flag: ads in the feed |

Both feature flags default to `false` — a feature only turns on for the exact value `'true'`.

## Permission model

Access is defined by two independent dimensions.

**Type** (`UserType`) — the relationship to an institution:

| Value | Meaning |
|---|---|
| `inactive` | Signup not yet confirmed |
| `comum` | Regular user |
| `institution admin` | Administers an institution |
| `institution owner` | Institution owner |

**Role** (`UserRole`) — the level on the platform:

| Value | Meaning |
|---|---|
| `basic` | Default |
| `moderator` | Access to the moderation panel |
| `super admin` | Full control |
| `banned` | Blocked |

Moderators cannot modify super admins, and cannot promote users beyond `basic`/`banned` — both rules are enforced server-side.

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Further documentation

- [`APP_GUIDELINES.md`](APP_GUIDELINES.md) — product overview and conventions
- [`frontend_guidelines.md`](frontend_guidelines.md) — frontend patterns
- [`backend_guidelines.md`](backend_guidelines.md) — backend patterns
