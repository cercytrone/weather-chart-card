# Optional Modern layout presentation

All switches default to the previous presentation and only affect Modern.

## Main → Header and attribute fields (Modern layout)

- **Centre weather icon between temperature and time** (`center_weather_icon`,
  default false) places the weather summary on the left, the icon in the middle,
  and clock/weekday/date on the right. Equal left/right grid tracks keep the icon
  at the horizontal centre, not merely halfway through the remaining free space.
  The icon remains centred if the clock is hidden. Narrow cards retain reduced
  icon sizing; large fonts may need adjustment to fit in their side tracks.
- **Show attribute field backgrounds** (`show_attribute_background`, default true)
  controls the backgrounds of humidity/pressure, UV/sun and current wind fields.
  Disabling it makes those fields transparent, leaving values, icons and spacing
  unchanged. It does not remove the card-wide theme/ambient background.

## Forecast

- **Dotted night / low temperature curve (Modern layout)**
  (`forecast.night_dotted`, default false) renders the low-temperature curve with
  round dots. The high-temperature curve stays solid. Fills, value markers and
  labels are unchanged; temperature gradients and neighbour-based edge extensions
  continue to work. If the integration supplies no `templow`, no low curve is
  invented. This is a low-temperature series, not a new historical/night feed.

```yaml
layout: modern
center_weather_icon: true
show_attribute_background: false
forecast:
  night_dotted: true
```

Each switch can be turned off independently without resetting other settings.
