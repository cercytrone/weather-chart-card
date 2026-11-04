# Changelog

## 3.0.1

- Optional `time_entity` in Main → Clock source to use an HA time/date entity for
  the header clock, weekday and date instead of an unsynchronised device clock.
- Supports ISO timestamps, HA-local date/time and time-only states; uses the HA
  time zone for absolute timestamps and never silently falls back on source errors.
- Tests cover wrong device dates, DST, invalid values, editor selection and live
  HA state updates. See `docs/clock-source.md` for update precision and limitations.

## 3.0.0

First stable release of the modernised fork, including the features developed
through v0.2.19-alpha and the refreshed README/screenshots.

### Added

- Optional responsive Modern layout with Home Assistant theme support and a
  data-driven SVG forecast chart. Classic remains the default.
- Modern editor tab grouping layout-specific settings: compact spacing, centred
  header icon, attribute-field backgrounds and independent top/bottom insets.
- Temperature-dependent gradients and optional coloured fills; optional dotted
  low-temperature curve, each controlled by native on/off switches.
- Precipitation badges, rounded blue-gradient bars or hidden precipitation row;
  adjustable bar area height and rainfall labels with one decimal.
- Independent font controls for time, weekday, date and current temperature;
  separate current, forecast and attribute icon sizes.
- Selectable forecast count (Modern defaults to five, up to 15 available entries).
- Bundled static/animated weather icons, explicit sizing and inline SVG fallbacks
  for failed images, reducing external dependencies for kiosk browsers.
- Current branch screenshots, reproducible browser-capture tooling and focused
  documentation for configuration and development.

### Fixed

- Clock/editor default mismatches and visibility of independent weekday/date.
- Missing sun-entity handling, forecast subscription cleanup/reconnection, clock
  timer cleanup, autoscroll scheduling and derived values after entity changes.
- Editor entity selection, settings navigation and unavailable legacy controls.
- Consistent modern title/content background and tighter condition-text spacing.
- Shared forecast alignment and edge continuation using supplied neighbouring
  values, or flat graphical extensions when neighbours are unavailable.
- Missing readings remain missing rather than becoming invented zero values.

### Updating

Update this fork through HACS and completely reload the frontend. For Fully Kiosk,
clear the web cache if needed. Keep only one weather-chart-card resource. Existing
cards remain Classic unless `layout: modern` is selected; new Modern options do
not require changes to existing YAML. Forecast availability depends on the weather
integration. A fully local card does not make a cloud weather integration local.

Automated tests and the lint/build pipeline have been run. Documentation screenshots
use deterministic demo data and simulated HA shell components, not a live Home
Assistant/Fire Tablet session; verify the display on your actual devices/themes.

### Dependency audit

At release preparation, `npm audit --omit=dev` reported no known vulnerabilities
in runtime dependencies. The full development dependency tree reported 11
moderate advisories, including legacy ESLint/copy-tool chains. Development tools
are not shipped as runtime dashboard scripts; toolchain migration is deferred
rather than applying breaking automated fixes during this release.
