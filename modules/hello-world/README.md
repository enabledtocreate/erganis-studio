# Hello World Stub Module

Phase 2 reference module loaded from `studio/modules/` by Core's module loader.

## Build

```bash
cd studio/modules/hello-world
npm install
npm run build
```

Core discovers `erganis.module.json` when `MODULES_ROOT` points at `studio/modules` (default from `core/services`).

## Operation

- **Surface:** `stub`
- **Action:** `save`
- **Handler:** `pingSave` — writes to `hello_world.greetings` inside orchestrator transaction
