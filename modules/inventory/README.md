# Inventory module (S-I1)

Simple product catalog — `inventory.products` schema, Surface `inventory` load/save.

## Operations

| Surface | Action | Handler | Purpose |
|---------|--------|---------|---------|
| `inventory` | `load` | `loadProducts` | List active products for org |
| `inventory` | `save` | `saveProduct` | Create or update product |

## Build

```bash
npm install && npm run build
```

Loaded by Core from `MODULES_ROOT` with other `studio/modules/*` packages.
