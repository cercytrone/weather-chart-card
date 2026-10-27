# Temperature gradients (Modern layout)

The visual editor exposes native checkboxes in **Temperature chart (Modern layout)**
below the forecast count and above the Settings tabs. In addition to the dotted-low
curve switch, the two colour controls are:

- **Temperature-based chart colours** enables temperature-dependent line, point
  and temperature-label colours (`forecast.temperature_gradient`, default false).
- **Apply temperature colours to chart fill** also colours the area beneath each
  segment (`forecast.gradient_fill`, default true, effective only when the first
  option is enabled). Area opacity fades towards the bottom.

```yaml
type: custom:weather-chart-card
entity: weather.home
layout: modern
forecast:
  temperature_gradient: true
  gradient_fill: true
```

The fixed scale interpolates from violet at -10°C through blue at 0°C, teal at
10°C, green at 20°C, yellow at 25°C, orange at 30°C and red at 40°C. Temperatures
outside that range retain the nearest endpoint colour. Fahrenheit and Kelvin
are converted to Celsius for colouring only; displayed values keep their units.
Missing values remain missing and do not bridge gaps in the curves.

Disable `temperature_gradient` to restore the configured high/low series colours
and their original fading fills. Disable only `gradient_fill` to keep temperature
colours on the curves while retaining the original area colours. These options
do not affect Classic or precipitation badges. Chart height, column alignment
and neighbour-based edge continuation are unchanged.
