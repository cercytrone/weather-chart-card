<h1 align="center">Weather Chart Card</h1>

# Backup
The original repository is no longer maintained. Feel free to fork it if you find it useful.

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/mlamberts7I)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=HZUUW64FRM2J2)

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mlamberts78/weather-chart-card?style=flat-square)](https://github.com/mlamberts78/weather-chart-card/releases/latest)
![GitHub downloads](https://img.shields.io/github/downloads/mlamberts78/weather-chart-card/total?style=flat-square)
![GitHub release (latest by SemVer including pre-releases)](https://img.shields.io/github/downloads/mlamberts78/weather-chart-card/latest/total)
[![HACS Validate](https://github.com/mlamberts78/weather-chart-card/actions/workflows/validate.yaml/badge.svg)](https://github.com/mlamberts78/weather-chart-card/actions/workflows/validate.yaml)

![weather-chart-card](https://github.com/mlamberts78/weather-chart-card/assets/93537082/bd5b9f6e-4125-4a19-9773-463e6d054bce)
![15-days](https://github.com/mlamberts78/weather-chart-card/assets/93537082/f4de6060-7005-4a6d-b1f3-3aa17c856c73)

## Installation

### HACS

This card is available in HACS (Home Assistant Community Store).
HACS is a third party community store and is not included in Home Assistant out of the box.

#### Configuration variables:

##### Card options

| Name                  | Type    | Default                  | Description                                                                                        |
| ----------------------| ------- | -------------------------|--------------------------------------------------------------------------------------------------- |
| type                  | string  | **Required**             | Should be `custom:weather-chart-card`.                                                             |
| entity                | string  | **Required**             | An entity_id with the `weather` domain.                                                            |
| temp                  | string  | none                     | An entity_id for a custom temperature sensor.                                                      |
| press                 | string  | none                     | An entity_id for a custom pressure sensor.                                                         |
| humid                 | string  | none                     | An entity_id for a custom humidity sensor.                                                         |
| uv                    | string  | none                     | An entity_id for a custom UV index sensor.                                                         |
| winddir               | string  | none                     | An entity_id for a custom wind bearing sensor. Sensor should have value in degrees                 |
| windspeed             | string  | none                     | An entity_id for a custom wind speed sensor.                                                       |
| feels_like            | string  | none                     | An entity_id for a custom feels like temperature sensor.                                           |
| dew_point             | string  | none                     | An entity_id for a custom dew point sensor.                                                        |
| wind_gust_speed       | string  | none                     | An entity_id for a custom wind gust speed sensor.                                                  |
| visibility            | string  | none                     | An entity_id for a custom visibility sensor.                                                       |
| description           | string  | none                     | An entity_id for a custom weather description sensor.                                              |
| title                 | string  | none                     | Card title.                                                                                        |
| show_main             | boolean | true                     | Show or hide a section with current weather condition and temperature.                             |
| show_temperature      | boolean | true                     | Show or hide the current temperature.                                                              |
| show_current_condition| boolean | true                     | Show or hide the current weather condition.                                                        |
| show_attributes       | boolean | true                     | Show or hide a section with attributes such as pressure, humidity, wind direction and speed, etc.  |
| show_sun              | boolean | true                     | Show or hide the sunset information                                                                |
| show_time             | boolean | false                    | Show or hide the current time on the card.                                                         |
| show_time_seconds     | boolean | false                    | Show or hide seconds for the current time on the card.                                             |
| show_day              | boolean | false                    | Show or hide the current day on the card. (Only visible when show_time is true.)                   |
| show_date             | boolean | false                    | Show or hide the current date the card. (Only visible when show_time is true.)                     |
| show_humidity         | boolean | true                     | Show or hide humidity on the card.                                                                 |
| show_pressure         | boolean | true                     | Show or hide pressure on the card.                                                                 |
| show_wind_direction   | boolean | true                     | Show or hide wind_direction on the card.                                                           |
| show_wind_speed       | boolean | true                     | Show or hide wind_speed on the card.                                                               |
| show_feels_like       | boolean | false                    | Show or hide feels like temperature on the card.                                                   |
| show_dew_point        | boolean | false                    | Show or hide dew point on the card.                                                                |
| show_wind_gust_speed  | boolean | false                    | Show or hide wind gust speed on the card.                                                          |
| show_visibility       | boolean | false                    | Show or hide visibility on the card.                                                               |
| show_description      | boolean | false                    | Show or hide the weather description on the card.                                                  |
| show_last_changed     | boolean | false                    | Show or hide when last data changed on the card.                                                   |
| use_12hour_format     | boolean | false                    | Display time in 12-hour format (AM/PM) instead of 24-hour format.                                  |
| icons                 | string  | none                     | Path to the location of custom icons in svg format, for example `/local/weather-icons/`.           |
| animated_icons        | boolean | false                    | Enable the use of animated icons                                                                   |
| icon_style            | string  | 'style1'                 | Options are 'style1' and'style2' for different set of animated icons.                              |
| icons_size            | number  | 25                       | The size of the animated or custom icons in pixels.                                                |
| current_temp_size     | number  | 28                       | The size of the current temperature in pixels.                                                     |
| time_size             | number  | 26                       | The size of the current time in pixels.                                                            |
| day_date_size         | number  | 15                       | The size of the current day and date in pixels.                                                    |
| forecast              | object  | none                     | See [forecast options](#forecast-options) for available options.                                   |
| units                 | object  | none                     | See [units of measurement](#units-of-measurement) for available options.                           |
| locale                | string  | none                     | See [Supported languages](#Supported-languages) for available languages                            |
| autoscroll            | boolean | false                    | Update the chart each hour, hiding prior forecast datapoints                                       |

##### Forecast options

| Name                 | Type    | Default                  | Description                                                                                        |
| -------------------- | ------- | -------------------------|--------------------------------------------------------------------------------------------------- |
| precipitation_type   | string  | rainfall                 | Show precipitation in 'rainfall' or 'probability'.                                                 |
| show_probability     | boolean | false                    | Also show probability value when precipitation_type = rainfall. (Only when available)              |
| labels_font_size     | number  | 11                       | Font size for temperature and precipitation labels.                                                |
| precip_bar_size      | number  | 100                      | Adjusts the thickness of precipitation bars (1-100).                                               |
| temperature1_color   | string  | rgba(255, 152, 0, 1.0)   | Temperature first line chart color.                                                                |
| temperature2_color   | string  | rgba(68, 115, 158, 1.0)  | Temperature second line chart color.                                                               |
| precipitation_color  | string  | rgba(132, 209, 253, 1.0) | Precipitation bar chart color.                                                                     |
| chart_datetime_color | string  | primary-text-color       | Chart day or hour color                                                                            |
| chart_text_color     | string  | none                     | Chart text color                                                                                   |
| chart_height         | number  | 180                      | Adjust the forecast chart height                                                                   |
| condition_icons      | boolean | true                     | Show or hide forecast condition icons.                                                             |
| show_wind_forecast   | boolean | true                     | Show or hide wind forecast on the card.                                                            |
| round_temp           | boolean | false                    | Option for rounding the forecast temperatures                                                      |
| style                | string  | style1                   | Change chart style, options: 'style1' or 'style2'                                                  |
| type                 | string  | daily                    | Show daily or hourly forecast if available, options: 'daily' or 'hourly'                           |
| number_of_forecasts  | number  | 0                        | Overrides the number of forecasts to display. Set to "0" for automatic mode.                       |
| disable_animation    | boolean | false                    | Disable the chart animation.                                                                       |

##### Units of measurement

| Name                 | Type    | Default                  | Description                                                                                        |
| -------------------- | ------- | -------------------------|--------------------------------------------------------------------------------------------------- |
| pressure             | string  | none                     | Convert to 'hPa' or 'mmHg' or 'inHg'                                                               |
| speed                | string  | none                     | Convert to 'km/h' or 'm/s' or 'Bft' or 'mph'                                                       |

###### What custom icons can I use?
Icons should be in svg format. Icons should have names as shown [here](https://github.com/mlamberts78/weather-chart-card/blob/master/src/const.js#L24). Example:
![130360372-76d70c42-986c-46e3-b9b5-810f0317f94f](https://github.com/mlamberts78/weather-chart-card/assets/93537082/d3ee55a2-e64f-4354-b36d-9faf6ea37361)

#### Example usage:
###### Card with current time, date and day
![date-time](https://github.com/mlamberts78/weather-chart-card/assets/93537082/ab2c32f7-8c6a-4a7e-84fc-f857a519a725)
```yaml
type: custom:weather-chart-card
entity: weather.weather_home
show_time: true
show_day: true
show_date: true
animated_icons: true
icon_style: style1

```
###### Style2 chart
![style2](https://github.com/mlamberts78/weather-chart-card/assets/93537082/3067cc43-0e80-492c-b4a5-771b1e44ea17)
```yaml
type: custom:weather-chart-card
entity: weather.my_home
forecast:
  style: style2
```
###### Chart only
![Chart-only](https://github.com/mlamberts78/weather-chart-card/assets/93537082/c99d85a4-30d1-4fd9-90ff-877421b39e9b)
```yaml
type: custom:weather-chart-card
entity: weather.my_home
show_main: false
show_attributes: false
forecast:
  condition_icons: false
  show_wind_forecast: false
```

###### Custom units
![Units](https://github.com/mlamberts78/weather-chart-card/assets/93537082/e72862ee-9bb7-4f97-9a3c-b17663c458aa)
```yaml
type: custom:weather-chart-card
entity: weather.my_home
units:
  pressure: mmHg
  speed: m/s
```

###### Supported languages:
| Language         | Locale  |
| ---------------- | ------- |
| Bulgarian        | bg      |
| Catalan          | ca      |
| Czech            | cs      |
| Danish           | da      |
| Dutch            | nl      |
| English          | en      |
| Finnish          | fi      |
| French           | fr      |
| German           | de      |
| Greek            | el      |
| Hungarian        | hu      |
| Italian          | it      |
| Lithuanian       | lt      |
| Norwegian        | no      |
| Polish           | pl      |
| Portuguese       | pt      |
| Romanian         | ro      |
| Russian          | ru      |
| Slovak           | sk      |
| Spanish          | es      |
| Swedish          | sv      |
| Ukrainian        | uk      |
| 한국어           | ko      |

## Modern layout (optional)

The existing layout remains the default. Select **Modern** in the visual editor,
 or add `layout: modern` to your card configuration:

```yaml
type: custom:weather-chart-card
entity: weather.home
layout: modern
locale: de
show_last_changed: true
forecast:
  type: daily
  number_of_forecasts: 5
  round_temp: true
```

The modern layout uses local styles, the active Home Assistant theme and a
responsive SVG temperature chart. It does not load Tailwind, change the page
background or provide a separate theme switch. No forecast values are hardcoded.

- Defaults to five forecasts; fewer are shown if that is all the integration supplies.
  `number_of_forecasts: 0` also uses five in this layout; explicit counts are capped at 15.
- Forecast columns have a minimum width of 56px and scroll horizontally when
  necessary. Below a card width of 300px, current-weather metrics stack vertically.
- Missing temperatures break the corresponding curve; absent low temperatures
  are omitted. Missing rain/wind values display a dash. Zero rainfall is hidden.
- Daily and hourly forecasts are supported if the weather entity supplies them.
- Existing visibility toggles, alternative sensors, icons, units, temperature colors,
  label size, chart height and temperature rounding remain configurable.
- Modern precipitation is shown as badges rather than bars. `precip_bar_size`,
  chart `style`, `show_probability` (additional probability beside rainfall), and
  Chart.js animation settings apply only to the classic chart. Select
  `precipitation_type: probability` to show probability badges instead of rainfall.
- Last-updated information uses the weather entity's `last_updated`, not a
  separate timestamp for forecast delivery.

After replacing `dist/weather-chart-card.js` in your Home Assistant installation,
reload frontend resources / clear the frontend cache as needed.

### Development checks

Use Node.js 22 or later:

```sh
npm install
npm test
npm run build
```

Tests cover temperature geometry (including negative, constant and missing
values), DOM rendering without `sun.sun`, the five-day default, and subscription
cleanup/reconnection. DOM tests are not a substitute for visual checks in Home
Assistant's dashboards and Companion App. Check light/dark themes, narrow and
wide dashboard columns, large text, and your actual weather integration before
releasing.

### Clock, date and UV controls

Clock, weekday and date are disabled by default. They can be selected independently
in the visual editor; `show_main: false` hides their containing current-weather
section. `show_uv` defaults to true and can hide the UV index without hiding the
sunrise/sunset times. UV requires an available numeric `uv_index` attribute or a
sensor configured with `uv`; zero is a valid reading.

```yaml
show_time: true
show_time_seconds: false
show_day: true
show_date: true
show_uv: true
```
