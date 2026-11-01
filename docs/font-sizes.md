# Font sizes

Under **Main → Font sizes (px)** the visual editor provides four independent
native numeric inputs. They work in Modern and Classic:

| Label | YAML key | Default | Range (px) |
| --- | --- | --- | --- |
| Time | `time_size` | 26 | 10–72 |
| Weekday | `day_size` | 15 | 10–48 |
| Date | `date_size` | 15 | 10–48 |
| Current temperature | `current_temp_size` | Modern 40 / Classic 28 | 12–96 |

```yaml
show_time: true
show_day: true
show_date: true
time_size: 30
day_size: 16
date_size: 14
current_temp_size: 42
```

`day_date_size` is still supported as the shared fallback for weekday and date.
Separate `day_size` and `date_size` values take precedence. The controls remain
available even when their corresponding display options are off; `show_main:
false` still hides the entire current-weather section.

Modern respects the chosen font sizes on narrow cards too, instead of silently
capping them. Use smaller sizes on narrow dashboard columns; very large values
can wrap text or exceed the available width. Icon sizes and forecast temperature
label sizes are independent; this setting changes the current temperature number,
not its unit symbol or the condition text.
