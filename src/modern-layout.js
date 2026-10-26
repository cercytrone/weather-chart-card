import {html, svg} from 'lit';
import {renderWeatherIcon} from './weather-icon.js';

export const numeric = value => value !== null && value !== '' && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;

// Absolute Celsius thresholds keep colours stable across forecasts and unit systems.
const temperaturePalette = [
  [-10, [129, 140, 248]], [0, [56, 189, 248]], [10, [45, 212, 191]],
  [20, [132, 204, 22]], [25, [250, 204, 21]], [30, [249, 115, 22]], [40, [239, 68, 68]],
];
export function temperatureColor(value, unit = '°C') {
  let temperature = numeric(value);
  if (temperature === null) return null;
  if (unit === '°F' || unit === 'F') temperature = (temperature - 32) * 5 / 9;
  else if (unit === 'K') temperature -= 273.15;
  const upper = temperaturePalette.findIndex(([limit]) => temperature <= limit);
  let rgb;
  if (upper === 0) rgb = temperaturePalette[0][1];
  else if (upper === -1) rgb = temperaturePalette[temperaturePalette.length - 1][1];
  else {
    const [low, a] = temperaturePalette[upper - 1];
    const [high, b] = temperaturePalette[upper];
    const fraction = (temperature - low) / (high - low);
    rgb = a.map((channel, i) => Math.round(channel + (b[i] - channel) * fraction));
  }
  return `rgb(${rgb.join(', ')})`;
}

const chartIds = new WeakMap();
let chartId = 0;

export function extendedGeometry(forecasts, previous = null, next = null) {
  const values = [...forecasts, previous, next].filter(Boolean).flatMap(item => [numeric(item.temperature), numeric(item.templow)]).filter(value => value !== null);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const range = Math.max(max - min, 4);
  const point = (item, index) => ({
    x: (index + 0.5) * 100 / forecasts.length,
    high: numeric(item.temperature), low: numeric(item.templow),
    highY: numeric(item.temperature) === null ? null : 32 + (max - Number(item.temperature)) / range * 100,
    lowY: numeric(item.templow) === null ? null : 32 + (max - Number(item.templow)) / range * 100,
  });
  const points = forecasts.map(point);
  // Neighbours share the visible scale, but do not become labelled columns.
  return {points, max, range, previous: previous ? point(previous, -1) : null, next: next ? point(next, forecasts.length) : null};
}

export function forecastGeometry(forecasts) {
  return extendedGeometry(forecasts).points;
}

export function forecastWindow(forecasts, count, cutoff, autoscroll, now = Date.now()) {
  const selected = forecasts.map((item, index) => ({item, index}))
    .filter(({item}) => !autoscroll || now - new Date(item.datetime) <= cutoff).slice(0, count);
  if (!selected.length) return {items: [], previous: null, next: null};
  const items = selected.map(({item}) => item);
  const previous = forecasts[selected[0].index - 1] || null;
  const next = forecasts[selected[selected.length - 1].index + 1] || null;
  return {
    items,
    previous: previous && Date.parse(previous.datetime) < Date.parse(items[0].datetime) ? previous : null,
    next: next && Date.parse(next.datetime) > Date.parse(items[items.length - 1].datetime) ? next : null,
  };
}

export function curvePoints(geometry, key) {
  const {points, previous, next} = geometry;
  if (!points.length) return [];
  const y = `${key}Y`;
  const first = points[0];
  const last = points[points.length - 1];
  const left = first[y] === null ? null : previous && previous[y] !== null ? previous : {...first, x: 0};
  const right = last[y] === null ? null : next && next[y] !== null ? next : {...last, x: 100};
  return [left, ...points, right].filter(Boolean);
}

export function renderModern(card) {
  const {config, weather} = card;
  if (!chartIds.has(card)) chartIds.set(card, `weather-chart-${++chartId}`);
  const id = chartIds.get(card);
  const gradient = config.forecast.temperature_gradient === true;
  const gradientFill = gradient && config.forecast.gradient_fill !== false;
  const temperatureUnit = weather.attributes.temperature_unit || card.getUnit('temperature');
  const colorFor = (value, fallback) => gradient ? temperatureColor(value, temperatureUnit) || fallback : fallback;
  const count = Math.max(1, Math.min(15, Math.floor(Number(config.forecast.number_of_forecasts)) || 5));
  const cutoff = (config.forecast.type === 'hourly' ? 1 : 24) * 3600000;
  const {items, previous: before, next: after} = forecastWindow(card.forecasts || [], count, cutoff, config.autoscroll);
  const geometry = extendedGeometry(items, before, after);
  const {points} = geometry;
  const format = value => value === null ? '–' : new Intl.NumberFormat(card.language, {maximumFractionDigits: config.forecast.round_temp ? 0 : 1}).format(value);
  const formatRainfall = value => new Intl.NumberFormat(card.language, {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value);
  const icon = item => renderWeatherIcon(card, item.condition, 'above_horizon', config.icons_size, card.ll(item.condition));
  const series = (key, color) => {
    // Break paths at missing readings rather than interpolating invented data.
    let previous;
    return svg`<g style=${`color:${color}`}>
      ${curvePoints(geometry, key).map((point, index) => {
        const y = point[`${key}Y`];
        const old = previous;
        previous = y === null ? null : point;
        return y === null ? svg`` : svg`
          ${old ? svg`
            ${gradientFill ? svg`<defs><linearGradient id=${`${id}-${key}-${index}`} gradientUnits="userSpaceOnUse" x1=${old.x} x2=${point.x} y1="0" y2="0">
              ${[0, 0.25, 0.5, 0.75, 1].map(fraction => svg`<stop offset=${fraction} stop-color=${temperatureColor(old[key] + (point[key] - old[key]) * fraction, temperatureUnit)}/>`)}
            </linearGradient></defs>` : ''}
            <path d=${`M ${old.x} ${old[`${key}Y`]} C ${(old.x + point.x)/2} ${old[`${key}Y`]}, ${(old.x + point.x)/2} ${y}, ${point.x} ${y} L ${point.x} 175 L ${old.x} 175 Z`} fill=${`url(#${gradientFill ? `${id}-${key}-${index}` : `${id}-${key}-fill`})`} fill-opacity=${gradientFill ? 0.2 : 1} mask=${gradientFill ? `url(#${id}-fade)` : 'none'}/>
            <path d=${`M ${old.x} ${old[`${key}Y`]} C ${(old.x + point.x)/2} ${old[`${key}Y`]}, ${(old.x + point.x)/2} ${y}, ${point.x} ${y}`} fill="none" stroke=${gradient ? `url(#${id}-temperature)` : 'currentColor'} stroke-width="2.5" vector-effect="non-scaling-stroke"/>` : ''}
          ${points.includes(point) ? svg`<ellipse cx=${point.x} cy=${y} rx="0.8" ry="3" fill=${colorFor(point[key], color)} stroke="var(--ha-card-background, var(--card-background-color))" vector-effect="non-scaling-stroke"/>` : ''}
        `;
      })}
    </g>`;
  };
  return html`
    <style>
      :host {display:block; min-width:0; container-type:inline-size;}
      ha-card {position:relative; border-radius:32px; overflow:hidden; background:var(--ha-card-background,var(--card-background-color)); color:var(--primary-text-color); box-shadow:var(--ha-card-box-shadow,0 10px 30px -12px #0005);}
      .modern {padding:20px; background:radial-gradient(circle at 100% 0%,#38bdf812,transparent 50%);}
      .main {display:grid; grid-template-columns:${config.current_icon_size}px minmax(0,1fr) auto; align-items:center; gap:12px; padding-bottom:20px; border-bottom:1px solid var(--divider-color); font-size:${config.current_temp_size}px; font-weight:800;}
      .main ha-icon {--mdc-icon-size:${config.current_icon_size}px; color:#38bdf8; flex-shrink:0;}
      .main img {width:${config.current_icon_size}px;height:${config.current_icon_size}px;}
      .main > div {min-width:0;overflow-wrap:anywhere;}
      .main .weather-icon {color:#38bdf8;}
      .weather-icon-svg {display:block;}
      .main span {font-size:22px; color:var(--secondary-text-color); font-weight:400;}
      .main .current-condition span,.main .feels-like,.main .description {font-size:14px; font-weight:400;}
      .main > div:not(.current-time) {line-height:1.05;}
      .main .current-condition {font-size:14px;line-height:1.2;margin-top:2px;}
      .main .current-condition span {line-height:inherit;}
      .main > .current-time {grid-column:3; text-align:right; margin:0; font-size:${config.time_size}px; font-weight:400; line-height:1.3;}
      #digital-clock {white-space:nowrap;}
      .date-text {font-size:${config.day_date_size}px;}
      .attributes {display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin:16px 0; font-size:12px; line-height:1.9;}
      .attributes > div {padding:10px; border-radius:16px; background:color-mix(in srgb,var(--primary-text-color) 5%,transparent); overflow-wrap:anywhere; min-width:0;}
      .attributes ha-icon {--mdc-icon-size:${config.attribute_icon_size}px;color:#38bdf8;}
      .forecast-scroll {overflow-x:auto; padding-bottom:4px;}
      .forecast {min-width:${items.length * 56}px;}
      .row {display:grid;grid-template-columns:repeat(${items.length || 1},minmax(0,1fr));text-align:center;align-items:center;gap:0;}
      .days {font-size:11px;font-weight:600;text-transform:uppercase;color:var(--secondary-text-color);margin-top:20px;}
      .plot {position:relative;height:${Math.max(120, Number(config.forecast.chart_height) || 150)}px;}
      svg {width:100%;height:100%;display:block;overflow:hidden;}
      .labels {position:absolute;inset:0;pointer-events:none;}
      .temp {position:absolute;transform:translate(-50%,-50%);font-size:${config.forecast.labels_font_size}px;font-weight:700;white-space:nowrap;}
      .rain {font-size:10px;color:#38bdf8;min-height:26px;}
      .rain span {display:inline-block;background:#38bdf815;border-radius:5px;padding:3px;overflow-wrap:anywhere;}
      .icons {padding:8px 0;color:#38bdf8;}
      .icons ha-icon {--mdc-icon-size:${config.icons_size}px;}
      .wind {padding-top:10px;border-top:1px solid var(--divider-color);font-size:11px;}
      .wind ha-icon {--mdc-icon-size:14px;}
      .wind small {display:block;font-size:9px;color:var(--secondary-text-color);}
      .updated,.empty {font-size:12px;color:var(--secondary-text-color);margin-top:12px;}
      ${config.compact === false ? '' : `
      .modern {padding:16px;}
      .main {padding-bottom:12px;line-height:1.1;}
      .attributes {gap:8px;margin:10px 0;font-size:12px;line-height:1.65;}
      .attributes > div {padding:8px;}
      .days {margin-top:10px;}
      .rain {min-height:20px;}
      .icons {padding:5px 0;}
      .wind {padding-top:6px;}
      .updated {margin-top:8px;}
      `}
      @container (max-width:300px) {.modern{padding:12px}.attributes{grid-template-columns:1fr;gap:6px}.attributes > div{padding:8px}.main{grid-template-columns:min(${config.current_icon_size}px,36px) minmax(0,1fr) auto;gap:6px;font-size:min(${config.current_temp_size}px,28px)}.main ha-icon{--mdc-icon-size:min(${config.current_icon_size}px,36px)}.main .weather-icon{max-width:36px;max-height:36px}.main img{width:min(${config.current_icon_size}px,36px);height:min(${config.current_icon_size}px,36px)}.main > .current-time{font-size:min(${config.time_size}px,20px)}.date-text{font-size:min(${config.day_date_size}px,12px)}}
      @media (prefers-reduced-motion:reduce) {*{animation:none!important;transition:none!important}}
    </style>
    <ha-card .header=${config.title || ''}><div class="modern">
      ${card.renderMain()}
      ${card.renderAttributes()}
      ${items.length ? html`<div class="forecast-scroll"><div class="forecast">
        <div class="row days">${items.map(item => html`<span>${Number.isNaN(Date.parse(item.datetime)) ? '–' : new Date(item.datetime).toLocaleString(card.language, config.forecast.type === 'hourly' ? {hour:'2-digit',minute:'2-digit'} : {weekday:'short'})}</span>`)}</div>
        <div class="plot">
          <svg viewBox="0 0 100 175" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              ${gradient ? svg`<linearGradient id=${`${id}-temperature`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="32" y2="132">
                ${Array.from({length: 41}, (_, i) => svg`<stop offset=${i / 40} stop-color=${temperatureColor(geometry.max - geometry.range * i / 40, temperatureUnit)}/>`)}
              </linearGradient>` : ''}
              ${gradientFill ? svg`
                <linearGradient id=${`${id}-fade-gradient`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
                <mask id=${`${id}-fade`} maskUnits="userSpaceOnUse" x="-100" y="0" width="300" height="175"><rect x="-100" y="0" width="300" height="175" fill=${`url(#${id}-fade-gradient)`}/></mask>
              ` : ''}
              <linearGradient id=${`${id}-high-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color=${config.forecast.temperature1_color} stop-opacity="0.2"/><stop offset="100%" stop-color=${config.forecast.temperature1_color} stop-opacity="0"/></linearGradient>
              <linearGradient id=${`${id}-low-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color=${config.forecast.temperature2_color} stop-opacity="0.16"/><stop offset="100%" stop-color=${config.forecast.temperature2_color} stop-opacity="0"/></linearGradient>
            </defs>
            <path d="M 0 60 H 100 M 0 110 H 100" stroke="var(--divider-color)" stroke-dasharray="2 2" stroke-width="0.3"/>
            ${series('high', config.forecast.temperature1_color)}${series('low', config.forecast.temperature2_color)}
          </svg>
          <div class="labels">${points.map(point => html`
            <span class="temp" style=${`left:${point.x}%;top:${(point.highY === null ? 32 : point.highY - 15)/175*100}%;color:${colorFor(point.high, config.forecast.temperature1_color)}`}>${format(point.high)}${point.high === null ? '' : '°'}</span>
            ${point.low === null ? '' : html`<span class="temp" style=${`left:${point.x}%;top:${(point.lowY+16)/175*100}%;color:${colorFor(point.low, config.forecast.temperature2_color)}`}>${format(point.low)}°</span>`}
          `)}</div>
        </div>
        <div class="row rain">${items.map(item => {
          const probability = config.forecast.precipitation_type === 'probability';
          const value = numeric(probability ? item.precipitation_probability : item.precipitation);
          return html`<div>${value === null ? '–' : value > 0 ? html`<span>${probability ? format(value) : formatRainfall(value)} ${probability ? '%' : weather.attributes.precipitation_unit || 'mm'}</span>` : ''}</div>`;
        })}</div>
        ${config.forecast.condition_icons === false ? '' : html`<div class="row icons">${items.map(item => html`<div>${icon(item)}</div>`)}</div>`}
        ${config.forecast.show_wind_forecast === false ? '' : html`<div class="row wind">${items.map(item => html`<div>${numeric(item.wind_speed) === null ? '–' : html`${item.wind_bearing === undefined ? '' : html`<ha-icon icon=${`hass:${card.getWindDirIcon(item.wind_bearing)}`}></ha-icon>`}${format(card.convertWindSpeed(Number(item.wind_speed)))}<small>${card.unitSpeed || ''}</small>`}</div>`)}</div>`}
      </div></div>` : html`<div class="empty" role="status">${card.language && card.language.startsWith('de') ? 'Keine Vorhersagedaten verfügbar.' : 'No forecast data available.'}</div>`}
      ${card.renderLastUpdated()}
    </div></ha-card>`;
}
