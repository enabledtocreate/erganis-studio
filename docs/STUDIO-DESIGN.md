# Studio — Refined Atelier design direction

> **Status:** Draft shell in `studio/apps/studio` (Tailwind). Shadcn migration at UI2.

## Principles

| Layer | Source | Application |
|-------|--------|-------------|
| Structure | Modern SaaS (A) | Left sidebar, data tables, forms |
| Material | Atelier (B) | Warm linen surfaces, charcoal ink, serif display titles |
| Accent | Charcoal primary | Buttons, active nav, links |
| Secondary | Forest green | Health/success states only |

## Tokens

Source: [`ui/tokens/erganis.tokens.json`](../../ui/tokens/erganis.tokens.json)

Studio mirrors tokens as CSS variables in `apps/studio/src/app/globals.css` until `@erganis/ui-shadcn` consumes the JSON build.

## Typography

- **Display** — Cormorant: editorial serif for page titles (fashion/interiors catalog feel)
- **UI** — Inter: navigation, tables, forms, labels

## Shell

`StudioShell` + `StudioSidebar` — echoes familiar Studio Designer left nav. Web and Electron share the same layout.

## Navigation labels

Editorial names where it helps: **Catalog** (inventory), **Vault** (documents, later).
