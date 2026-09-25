# ShopWave — Lab 0 (Keycloak course starter)

Unauthenticated ecommerce demo: React + FastAPI, Docker Compose. Each course module adds Keycloak and replaces the sidebar role switcher with real identity.

## Why it works as a course starter

| What a course needs | What you have |
| --- | --- |
| Real app, not a hello-world | Shop, cart, orders, admin views |
| No auth yet | Open APIs + sidebar role toggle (fake roles) |
| Clear “things to protect” | Reports, all purchases, maybe `POST /api/orders` |
| Two personas to map to Keycloak | Customer vs Admin → realm roles or groups |
| Docker workflow | `api` + `web` in Compose; Keycloak is the next service |

The fake **Customer / Admin** switch is useful: students replace it step by step with Keycloak login and JWT claims instead of learning commerce and OIDC at once.

## Natural lesson order (typical arc)

1. **Run the stack** — understand proxy (`/api` → FastAPI), no tokens.
2. **Add Keycloak** (+ Postgres if you want persistence) to `docker-compose.yml`.
3. **Realm** — clients for SPA (`web`) and optionally API; roles `customer`, `admin`.
4. **React** — Keycloak JS / OIDC login; remove role buttons; read roles from token.
5. **FastAPI** — validate JWT (issuer, audience, JWKS); enforce `admin` on `/api/reports` and optionally on listing all orders.
6. **Polish** — CORS, redirect URIs, logout, token refresh, “admin can’t checkout” from real roles.

## What to keep intentionally minimal (for now)

- In-memory orders/products — fine until you teach DB or Keycloak-only concerns.
- APIs still open on the server — fine for **module 1**; **module 2** is “API trusts Keycloak, not the UI.”
- This README is the course outline anchor; extend it per module as you record.

## One caveat

The UI hides admin content when not Admin, but the **API does not** — that’s correct for teaching: students should see that **frontend gating is not security** and then lock down the backend.

## Bottom line

Use `core/` as **Lab 0 — unauthenticated ShopWave**. Each module adds Keycloak and replaces the sidebar role switcher with real identity.

## Optional next step (course-ready repo)

Add a minimal Docker Compose overlay (Keycloak + Postgres, env templates, and stub comments in `main.py` / `App.jsx` for where JWT hooks go) without wiring auth until your lessons do.

## Run Lab 0

Shop (API + React) — always use this first:

```bash
cd core
docker compose up --build
```

- UI: http://localhost:3000 (not Vite’s http://localhost:5173)  
- API docs: http://localhost:8000/docs  

Keycloak is optional until your module needs it:

```bash
cd core
docker compose --profile keycloak up --build
```

- Keycloak admin: http://localhost:8080 (user `admin`, password `admin123`)  

Check that the shop containers are up:

```bash
docker compose ps
```

You should see `core-api` and `core-web` with status **Up** (and **healthy** for the API). If they are missing, something else is using port **8000** or **3000** — stop that process or change the host ports in `docker-compose.yml`.

### Shop UI or API not loading

1. Run from the **`core/`** directory (where `docker-compose.yml` lives).  
2. Use **http://localhost:3000** for the app; the browser talks to FastAPI through nginx at `/api/...`.  
3. After Keycloak troubleshooting, run **`docker compose up --build`** again (without service names) so **api** and **web** start — not only `postgres` / `keycloak`.  
4. Confirm: `curl -s http://localhost:8000/health` → `{"status":"ok"}` and `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`.

### Keycloak: `password authentication failed for user "keycloak"`

Postgres only applies `POSTGRES_USER` / `POSTGRES_PASSWORD` on **first** init. If the data volume already existed (log line: *Skipping initialization*), the password in the volume may not match `keycloak123` in compose.

Reset Keycloak’s database volumes and start again:

```bash
cd core
docker compose --profile keycloak down -v
docker compose --profile keycloak up --build
```

`-v` removes named volumes (`shopwave_postgres_data`, `shopwave_keycloak_data`). You lose prior Keycloak realm data in Docker; fine for local lab work.
