# DevScope — GitHub Explorer (Angular 20)

DevScope is a **portfolio-ready Angular 20** app that works like a **GitHub Explorer**: search repositories, paginate results, and open a repository detail view with nested tabs (**Overview / Contributors / Issues**).

> **Primary goal:** learn modern Angular by building a real app around real APIs, focusing on routing, HTTP, Signals + RxJS, pagination, caching, interceptors/guards, roles-based access control, directives/pipes, and testing.

---

## ✨ Features (MVP)

- **Repo search** with debounced input, filters, and **URL query-param sync**
- **Pagination** for search results (`page`, `per_page`)
- **Repo details** page with nested routes/tabs:
  - Overview (metadata)
  - Contributors (paged list)
  - Issues (paged list, open/closed toggle)
- **Favorites** (save/unsave repos) persisted in `localStorage`
- **API layer** with typed models + centralized error handling
- **HTTP interceptors** (functional) for auth token + error normalization
- **Modern templates** using `@if`/`@for` control flow and `track` for list performance
- **Deferrable views** (`@defer`) for heavy tab content (optional but recommended)

---

## 🔐 Auth + Roles (Client-side RBAC)

DevScope includes a **lightweight, client-side role system** to practice real-world Angular patterns (guards, conditional UI, route protection). **Do not rely on client-side guards for real security**—Angular explicitly warns that browser JavaScript can be modified by the user; authorization must also be enforced server-side. citeturn12search110

### Roles

- **Guest** (default)
  - Can browse `/repos` and repository details.
  - Cannot save favorites (or is prompted to “sign in”).

- **User**
  - All Guest capabilities.
  - Can save/unsave favorites.

- **Admin**
  - All User capabilities.
  - Can access admin-only settings (e.g., token management UI, clear cache, debug tools).

### How it works (recommended implementation)

- A simple **AuthStore/AuthService** holds `isAuthenticated` and `role` (e.g., `'guest' | 'user' | 'admin'`).
- Values are persisted to `localStorage` so refresh keeps the session.
- Route access is enforced with **functional route guards** (e.g., `CanActivateFn`, `CanMatch`) which Angular documents as the modern guard approach. 
### Guard examples (behavior)

- `authGuard`: blocks routes that require login (redirect to `/settings` or a `/login` page).
- `roleGuard('admin')`: blocks non-admin users from `/settings/admin`.

> Tip: `CanMatch` is useful when you want the router to *skip* a route and match a fallback route instead of just blocking navigation. citeturn12search110

### UI access control

- Use a structural directive like `*appIfRole="'admin'"` to show/hide admin-only controls.
- Use `@if` blocks in templates for role-based rendering.

---

## 🧰 Tech Stack

- **Angular 20** (standalone-first)
- **SCSS**
- **GitHub REST API**
- Optional UI scaffolding: **Angular Material schematics** for quick navigation/table shells

---

## 🗺️ Routes

- `/repos` — repository search + filters + pagination
- `/repos/:owner/:name` — repository detail
  - `/repos/:owner/:name/overview`
  - `/repos/:owner/:name/contributors`
  - `/repos/:owner/:name/issues`
- `/favorites` — saved repositories (**User/Admin**)
- `/settings` — defaults (page size), token status, clear cache
  - `/settings/admin` — admin tools (**Admin**)

---

## 🔌 API Notes (GitHub)

GitHub has **rate limits**. For a smooth dev experience, use a **Personal Access Token** (PAT) and send it as an `Authorization` header via an interceptor.

- Token is **optional**, but recommended.
- **Never commit** your token.

---

## ✅ Prerequisites

- Node.js (LTS recommended)
- Angular CLI

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a local environment file (example):

- `src/environments/environment.development.ts` (or edit your existing one)

```ts
export const environment = {
  production: false,
  githubToken: '', // optional: GitHub PAT
};
```

> Tip: You can also keep secrets outside the repo by using your own local strategy (e.g., not committing environment files).

### 3) Run the app

```bash
npm start
# or
ng serve
```

Open: http://localhost:4200/

---

## 🧩 HTTP + Interceptors (recommended setup)

Angular documents interceptors as middleware for common patterns (auth headers, error handling, caching) and supports functional interceptors configured via `provideHttpClient` + `withInterceptors`.

Example shape (illustrative):

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    ),
  ],
};
```

---

## 🧠 State & Reactivity Approach

Use a **Signals-first** approach for UI state (loading/error/data) and RxJS for async request flows, bridging where useful.

Suggested pattern:

- `RepoStore` service exposes:
  - `query`, `filters`, `page`, `perPage` as Signals
  - `repos`, `total`, `loading`, `error` as derived Signals
- API calls are centralized in `GitHubApiService`

---

## 🧱 Suggested Folder Structure

```text
src/
  app/
    core/
      api/
      interceptors/
      guards/
      auth/
      models/
      cache/
    shared/
      components/
      directives/
      pipes/
    features/
      repos/
      repo-detail/
      favorites/
      settings/
```

---

## 🧪 Testing (Minimum)

Write tests for:

- `GitHubApiService` (including caching behavior)
- One component (repos list)
- One interceptor (adds auth header)
- One pipe (e.g., `relativeTime`)
- One directive (e.g., `autofocus`)
- One guard (role-based access)

---

## 🧾 Definition of Done (MVP)

- Repo search works with filters + pagination; state is reflected in URL
- Repo detail with nested routes works
- Contributors and Issues load from real GitHub endpoints
- Favorites persist after refresh (User/Admin)
- Interceptor handles token + consistent error UX
- Roles and route protection are implemented with functional guards
- At least **2 custom pipes** and **1 custom directive** are used
- Minimal test suite exists

---

## 🌱 Stretch Goals

- Parse **Link headers** for next/prev pagination on list endpoints
- More robust caching + invalidation
- Infinite scroll directive alternative
- CI pipeline (lint + test)

---

## 📌 Optional: Instant UI Scaffolding

If you want a usable UI **without caring about design**, Angular Material provides CLI schematics for:

- navigation shell (`@angular/material:navigation`)
- table with sorting/pagination (`@angular/material:table`)

These are great to bootstrap UI fast.

---

## 📄 License

MIT License
