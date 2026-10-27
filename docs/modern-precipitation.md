# Modern precipitation display

Under **Settings → Modern → Precipitation**, select a native dropdown option:

- **Badges** (`badges`, default): preserves the previous compact badges.
- **Bars** (`bars`): a separate blue-gradient bar area below the temperature plot
  and above the condition icons. Bars are narrow, centred in the same columns as
  day labels/icons, and have rounded top corners. Quantities appear below them.
- **Off** (`off`): removes the precipitation row without affecting temperature,
  condition icons or forecast wind.

**Bar chart height (px)** controls the bar area, excluding the quantity labels.
It defaults to 40px, supports 20–100px and is editable when Bars is selected.

```yaml
layout: modern
forecast:
  precipitation_style: bars
  precipitation_height: 40
  precipitation_type: rainfall
```

Rainfall uses a common linear scale whose maximum is the largest valid amount in
**the visible forecast window**. Thus heights are comparable within one card, not
necessarily across cards/windows. Zero shows no bar but retains its `0.0` label;
missing/invalid/negative quantities display a dash and no bar. No precipitation
values are invented. Rainfall labels always use one decimal, independently of
`round_temp`, and use the entity's precipitation unit (default mm). Locale affects
the decimal separator, e.g. `0,4 mm` with `locale: de`.

The existing **Forecast → Precipitation Type** also applies here. Probability bars
use a fixed 0–100% scale and percentage labels. Out-of-range probabilities are
missing data, not clamped/invented values. Only actual provider values are shown.

Badges remain the default. Existing YAML and Classic charts are unaffected by the
new options; `precip_bar_size` continues to configure Classic bar thickness.
The Modern bar drawing uses ordinary CSS gradients/flex layouts and explicitly
sized tracks. A real Fully Kiosk visual test is still recommended after updating.
