const missing = () => ({time: '–', day: '–', date: '–'});

function wallDate(year, month, day, hour, minute, second) {
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return null;
  const value = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return value.getUTCFullYear() === year && value.getUTCMonth() === month - 1 && value.getUTCDate() === day ? value : null;
}

function serverTimeZone(hass) {
  const zone = hass.config && hass.config.time_zone || 'UTC';
  try { new Intl.DateTimeFormat('en', {timeZone: zone}).format(0); return zone; }
  catch (error) { return 'UTC'; }
}

// Read entity snapshots, never extrapolate them using an unsynchronised device clock.
// Wall-clock states already represent HA local time; ISO timestamps use HA's zone.
export function clockDisplay(hass, config, language, deviceNow = new Date()) {
  const options = {hour12: config.use_12hour_format === true, hour: 'numeric', minute: 'numeric', second: config.show_time_seconds === true ? 'numeric' : undefined};
  const format = (value, zone, kind) => {
    const settings = kind === 'time' ? options : kind === 'day' ? {weekday: 'long'} : {month: 'long', day: 'numeric'};
    return new Intl.DateTimeFormat(language, {...settings, ...(zone ? {timeZone: zone} : {})}).format(value);
  };
  if (!config.time_entity) return {time: format(deviceNow, null, 'time'), day: format(deviceNow, null, 'day'), date: format(deviceNow, null, 'date')};
  const entity = hass.states[config.time_entity];
  if (!entity || typeof entity.state !== 'string') return missing();
  const state = entity.state.trim();
  const zone = serverTimeZone(hass);
  let time;
  let date;
  let displayZone = 'UTC';
  // ISO 8601 timestamp with an explicit offset (e.g. sensor.date_time_iso).
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/i.test(state)) {
    const parts = state.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/i);
    if (!wallDate(Number(parts[1]), Number(parts[2]), Number(parts[3]), Number(parts[4]), Number(parts[5]), Number(parts[6] || 0))) return missing();
    time = new Date(state);
    if (!Number.isFinite(time.getTime())) return missing();
    date = time;
    displayZone = zone;
  } else {
    // input_datetime and the Time & Date integration's date_time / time_date states.
    let match = state.match(/^(\d{4})-(\d{2})-(\d{2})[T, ]+(\d{2}):(\d{2})(?::(\d{2}))?$/);
    const reversed = state.match(/^(\d{2}):(\d{2})(?::(\d{2}))?,?\s+(\d{4})-(\d{2})-(\d{2})$/);
    if (!match && reversed) match = [reversed[0], reversed[4], reversed[5], reversed[6], reversed[1], reversed[2], reversed[3]];
    if (match) {
      time = wallDate(Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6] || 0));
      date = time;
    } else {
      const onlyTime = state.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
      if (!onlyTime) return missing();
      time = wallDate(2000, 1, 1, Number(onlyTime[1]), Number(onlyTime[2]), Number(onlyTime[3] || 0));
      // Time-only entities have no date. Use HA's update timestamp, not the tablet's date.
      const updated = new Date(typeof entity.last_updated === 'string' ? entity.last_updated : NaN);
      if (Number.isFinite(updated.getTime())) {
        const parts = new Intl.DateTimeFormat('en', {timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric'}).formatToParts(updated);
        const part = key => Number(parts.find(item => item.type === key).value);
        date = wallDate(part('year'), part('month'), part('day'), 12, 0, 0);
      }
    }
    if (!time) return missing();
  }
  return {time: format(time, displayZone, 'time'), day: date ? format(date, displayZone, 'day') : '–', date: date ? format(date, displayZone, 'date') : '–'};
}
