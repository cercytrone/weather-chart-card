# Documentation screenshots

Generated from this branch's `dist/weather-chart-card.js` with real Chromium rendering:

- `modern-light.png` / `modern-dark.png`: the same five-day Modern card in two themes,
  with centred icon, clock/day/date, gradients, dotted lows and rainfall bars.
- `classic-light.png`: Classic style2, with clock/day/date disabled in this example.
- `editor-modern.png`: the actual card editor's navigation and complete Modern tab.

**Provenance:** deterministic demo data at 2026-10-27 13:00 Europe/Berlin, not a live
weather source or a screenshot of a user's HA/Fire Tablet. Card code and editor
are the branch bundle; the harness supplies lightweight `ha-card`, `ha-icon` and
`ha-textfield` shells instead of running a full Home Assistant installation.
Screenshots demonstrate branch features, not a guarantee for all themes/WebViews.
No image generation, image retouching or external screenshot URLs are used.

## Reproduce

On Linux x86-64, after installing the normal project dependencies:

```sh
npm run build
npm install --no-save --no-package-lock playwright-core@1.64.1 @sparticuz/chromium@153.0.0
node scripts/capture-docs.mjs
```

The optional packages are tooling only and are not added to the card dependencies.
The Chromium package contains the browser and Linux libraries, so no browser
binary download from another host is required. `tar` must be available. The script
extracts its browser libraries in the OS temporary directory and does not put
browser binaries in Git. The temporary loopback server shuts down after capture.

The harness uses 2× pixel density, a fixed clock and demo forecasts. GPU rendering
is disabled to avoid serverless screenshot compositing artefacts. Runtime page
errors fail the capture. The editor viewport is expanded so its full tab is not
clipped. To change the screenshot configuration or demo values, edit
`scripts/capture-docs.mjs`, rebuild the card if needed, and regenerate all images.
