# Erganis Studio

**Presentation tier** — Designer studio, client portal, and Studio modules in one repo.

## Structure

```
studio/
├── apps/studio/           # Designer application
├── apps/client/           # Client portal
├── modules/               # First-party plugins (agora, documents, …)
├── modules/third-party/   # External modules
└── shared/                # Shared UI, API clients
```

Each app has its own build/deploy setup. All consume **Core Surface API** (SDK or live OpenAPI URL).

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
