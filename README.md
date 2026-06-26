# Erganis Studio

**Presentation tier** — Designer studio, client portal, and Studio modules in one repo.

## Structure

```
studio/
├── apps/studio/           # Designer application
├── apps/client/           # Client portal
├── modules/               # First-party plugins (agora, documents, …)
├── modules/third-party/   # External modules
└── shared/                # shadcn/ui + Tailwind, API clients, icons loader
```

## Shared database (Studio + Client)

**Studio and Client use the same Core PostgreSQL database** via Core Surface API.

- Client approvals, comments, and selections **feed directly** into the same org/project data designers see in Studio.
- Separate deployable apps; **not** separate databases.
- Role-based surfaces and layouts differ; data model is shared.

**To refine:** How Client and Studio engage the same database in practice — API boundaries, orchestration, permissions, and conflict handling (see architecture spec §23).

## Module install

Enabling or upgrading a module runs **manifest-declared migrations** against Core/Studio schema (via Core migrator). See `core/contracts/schemas/module/`.

## UI stack

- **shadcn/ui** + **Tailwind CSS** in `shared/` (primary)
- **Mantine** under evaluation as an alternative
- **Icons:** free vector set loaded from a **separate asset host** (keeps repo lean)

## Dependencies

- **erganis-core** — contracts and SDK (`core/contracts/sdk/`)
- **Core services** — backend API

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `API_BASE_URL` | Yes | Core API (e.g. http://localhost:5000) |
| `API_TIMEOUT` | No | Request timeout ms (default 30000) |
| `AUTH_ENABLED` | No | Enable auth (default true) |
| `NODE_ENV` | No | development \| production |
| `LOG_LEVEL` | No | debug \| info \| warn \| error |

## GitHub

**Owner:** [enabledtocreate](https://github.com/enabledtocreate)  
**Repo:** `erganis-studio`
