import {html, svg} from 'lit';
import {
  mdiWeatherNight, mdiWeatherCloudy, mdiAlertCircleOutline, mdiWeatherFog,
  mdiWeatherHail, mdiWeatherLightning, mdiWeatherLightningRainy,
  mdiWeatherPartlyCloudy, mdiWeatherPouring, mdiWeatherRainy,
  mdiWeatherSnowy, mdiWeatherSnowyRainy, mdiWeatherSunny,
  mdiWeatherWindy, mdiWeatherWindyVariant,
} from '@mdi/js';
import {weatherIconsDay, weatherIconsNight} from './const.js';
import bundledIcons from './bundled-weather-icons.js';

const paths = {
  'clear-night': mdiWeatherNight, cloudy: mdiWeatherCloudy, exceptional: mdiAlertCircleOutline,
  fog: mdiWeatherFog, hail: mdiWeatherHail, lightning: mdiWeatherLightning,
  'lightning-rainy': mdiWeatherLightningRainy, partlycloudy: mdiWeatherPartlyCloudy,
  pouring: mdiWeatherPouring, rainy: mdiWeatherRainy, snowy: mdiWeatherSnowy,
  'snowy-rainy': mdiWeatherSnowyRainy, sunny: mdiWeatherSunny,
  windy: mdiWeatherWindy, 'windy-variant': mdiWeatherWindyVariant,
};

export function bundledWeatherIcon(condition, sun, style = 'style1') {
  const names = sun === 'below_horizon' ? weatherIconsNight : weatherIconsDay;
  const icons = bundledIcons[style] || bundledIcons.style1;
  return icons[names[condition]] || icons.exceptional;
}

// Render standard weather icons directly: older Android WebViews need neither
// HA's asynchronous icon loader nor external image requests for these symbols.
export function renderWeatherIcon(card, condition, sun, size, label = '') {
  const usesImage = card.config.animated_icons || card.config.icons;
  const source = usesImage ? card.getWeatherIcon(condition, sun) : null;
  const failed = card._failedWeatherIcons && card._failedWeatherIcons.has(source);
  const fallback = svg`<svg class="weather-icon-svg" viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true"><path fill="currentColor" d=${paths[condition] || paths.exceptional}/></svg>`;
  return html`<span class="weather-icon" role="img" aria-label=${label || condition || 'Weather'}
    style=${`display:inline-flex;flex-shrink:0;width:${size}px;height:${size}px;vertical-align:middle;line-height:0;`}>
    ${source && !failed ? html`<img class="weather-icon-image" src=${source} width=${size} height=${size} alt=""
      style="display:block;width:100%;height:100%;object-fit:contain;"
      @error=${() => {
        if (!card._failedWeatherIcons) card._failedWeatherIcons = new Set();
        card._failedWeatherIcons.add(source);
        card.requestUpdate();
      }}>` : fallback}
  </span>`;
}
