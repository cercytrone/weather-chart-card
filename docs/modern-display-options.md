# Optional Modern layout presentation

All switches default to the previous presentation and only affect Modern.

## Modern → Header and attribute fields

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

## Modern → Temperature chart (Modern layout)

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

All Modern-only settings now live in the **Modern** tab next to Main and Forecast.
Boolean options use native accessible slider switches; vertical insets use numeric
fields. Shared font and icon sizes remain in Main. Existing YAML keys are unchanged.

## Modern → Precipitation

Choose **Badges**, **Bars** or **Off**, and adjust the bar area height when Bars is
selected. See [Modern precipitation display](modern-precipitation.md) for scaling,
zero/missing values, units and YAML options.
