# Erganis Studio

Designer application — **web** (Next.js) and **desktop** (Electron) from one UI codebase.

## Prerequisites

- Node.js 20+
- Core API running (`core/services` on port 5000)
- Postgres + migrations (see Core docs)

## Quick start (web)

```bash
cd studio
npm install
cp apps/studio/.env.example apps/studio/.env.local
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000). After login, use **Inventory** on the dashboard (`/inventory`) for the S-I1 product catalog.

## Modules

| Slice | Path | Notes |
|-------|------|-------|
| Ref | `modules/hello-world/` | Envelope smoke test |
| S-I1 | `modules/inventory/` | `inventory.products` + Surface `inventory` load/save |

## Quick start (desktop)

Starts the Next dev server, then opens Electron:

```bash
cd studio
npm install
npm run dev:desktop
```

## Build

| Target | Command | Output |
|--------|---------|--------|
| Web (production) | `npm run build:web` | `apps/studio/.next/` |
| Desktop (compile) | `npm run build:desktop` | `apps/desktop/dist-electron/` + bundled Next standalone |
| Desktop Mac | `npm run package:desktop:mac` | `apps/desktop/dist/*.dmg`, `*.zip` |
| Desktop Windows | `npm run package:desktop:win` | `apps/desktop/dist/*.exe` |

**Note:** Windows installers are best built on Windows (or CI `windows-latest`). Mac builds require macOS (or CI `macos-latest`).

## Layout

```
studio/
├── apps/
│   ├── studio/     # Next.js web app (@erganis/studio-web)
│   └── desktop/    # Electron shell (@erganis/studio-desktop)
├── shared/         # API client, config (@erganis/studio-shared)
├── modules/        # Core-loaded domain modules (hello-world, inventory, …)
└── docs/
```

## Environment

| Variable | App | Default |
|----------|-----|---------|
| `NEXT_PUBLIC_CORE_API_URL` | Web | `http://localhost:5000` |
| `NEXT_PUBLIC_DEFAULT_ORG_SLUG` | Web | `demo` |
| `STUDIO_WEB_PORT` | Desktop (embedded server) | `3310` |
| `CORE_API_URL` | Desktop preload | `http://localhost:5000` |

## Docs

- [STUDIO-IMPLEMENTATION-PLAN.md](docs/STUDIO-IMPLEMENTATION-PLAN.md)
- [Product plan §7 Studio](../docs/erganis-product-plan.md#7-studio)
