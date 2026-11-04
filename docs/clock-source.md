# Home Assistant clock source

In **Main → Clock source → Home Assistant time entity (optional)** select an entity
instead of **Device clock (default)**. This works in Classic and Modern and is
useful for tablets whose device clock is not synchronised. The tablet needs a
connection to Home Assistant, but no direct internet access. Home Assistant must
itself have an accurate clock and publish a regularly updated time entity.

```yaml
type: custom:weather-chart-card
entity: weather.home
layout: modern
show_time: true
show_day: true
show_date: true
time_entity: sensor.date_time_iso
```

The entity ID above is an example. Use Home Assistant's **Time & Date** integration
to enable a date/time ISO sensor and select its actual entity ID. `sensor.time` is
also supported. The picker lists sensor, input_datetime and time entities; not all
of them are live clocks, so choose one whose state updates automatically.

## Supported state formats

- ISO timestamp with offset: `2026-11-04T13:34:56+01:00` or
  `2026-11-04T12:34:56Z`. Time, weekday and date use HA's configured `time_zone`,
  including daylight saving changes, not the tablet's time zone.
- HA-local date/time: `2026-11-04 13:34:56`, `2026-11-04, 13:34`, or
  `13:34, 2026-11-04`. These are treated as already-local wall-clock values.
- Time only: `13:34` or `13:34:56`. Weekday/date are taken from the entity's
  `last_updated` timestamp in HA's time zone. If that timestamp is absent or
  invalid, weekday/date show a dash instead of using the device date.

With an entity selected, values are snapshots updated by Home Assistant. The card
**does not advance them with the inaccurate tablet clock**. A minute-resolution
source shows `:00` if seconds are enabled; actual current seconds require a source
that supplies them and updates accordingly. A manually set `input_datetime` stays
at that value until something updates it. If the HA connection is lost, the last
received values remain; they are not guaranteed current while offline.

Missing entities, `unknown`, `unavailable`, unsupported or invalid states display
`–`, never a silent fallback to device time. If HA has no valid time-zone setting,
ISO/update timestamps use UTC. Select **Device clock (default)** to return to the
previous behaviour. `use_12hour_format` and font sizes remain applicable.

This option changes only the card's header clock/weekday/date. It does not change
the tablet's operating-system clock, timestamp formatting elsewhere, relative
last-updated ages or autoscroll cutoffs. Those may still be affected by an incorrect
device clock. No external clock service or new network request is introduced;
the card reads entity states from its existing HA connection.
