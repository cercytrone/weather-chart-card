# Weather icons and Android / Fully Kiosk

Current weather and forecast symbols share one renderer in Modern and Classic:

- Standard weather symbols use bundled Material Design SVG paths rendered directly
  in the card. They do not depend on HA's asynchronous weather-icon lookup.
- `animated_icons: true` uses the existing style1/style2 SVGs embedded as data URLs
  in the JavaScript bundle. No jsDelivr requests or separately installed icon
  directory is required. Each image has explicit dimensions and fits its box.
- A custom `icons` path is still supported. A trailing slash is optional. For
  backward compatibility, animated icons take precedence if both are configured.
- If an image fails to load, its slot falls back to a bundled inline SVG instead
  of displaying an empty/broken image. A failed URL is retried on frontend reload.
- Unknown conditions receive an exceptional/alert symbol instead of an undefined
  icon URL. Existing icon size controls apply to the shared renderer.

The attribute and forecast wind icons still use HA icons. No changes to their
configuration are needed.

## Fully Kiosk troubleshooting

After updating in HACS, fully reload the dashboard or clear the Fully Kiosk web
cache. If symbols remain missing, record the Fire OS / Android System WebView
version, Fully Kiosk version, installed card release and the card YAML (especially
`animated_icons`, `icon_style`, `icons` and icon sizes). A screenshot of the same
card on desktop and on the tablet helps separate image-loading problems from
layout problems. Update the WebView / Fully Kiosk where supported by the device.

The automated DOM tests cover local SVGs, embedded animated sets, explicit sizing,
custom paths and image-error fallbacks in both layouts. They are not an on-device
Fully Kiosk rendering test. Animation support depends on the device's WebView;
the embedded SVGs should remain visible even where animation is not supported.

## Building assets

`npm run generate:icons` regenerates `src/bundled-weather-icons.js` from the existing
`src/icons` and `src/icons2` assets. `npm run build` runs the generator automatically.
The generated module is committed so direct source imports and tests work without
an extra setup step. External SVG assets are kept for backward compatibility.
