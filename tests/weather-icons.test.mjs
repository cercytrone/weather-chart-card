import assert from 'node:assert/strict';
import {bundledWeatherIcon} from '../src/weather-icon.js';
import {weatherIconsDay} from '../src/const.js';

for (const style of ['style1', 'style2']) {
  for (const condition of [...Object.keys(weatherIconsDay), 'unknown']) {
    const url = bundledWeatherIcon(condition, 'above_horizon', style);
    assert.ok(url.startsWith('data:image/svg+xml;base64,'));
    assert.ok(Buffer.from(url.split(',')[1], 'base64').toString().includes('<svg'));
  }
  assert.notEqual(bundledWeatherIcon('sunny', 'above_horizon', style), bundledWeatherIcon('sunny', 'below_horizon', style));
  assert.notEqual(bundledWeatherIcon('partlycloudy', 'above_horizon', style), bundledWeatherIcon('partlycloudy', 'below_horizon', style));
}
assert.equal(bundledWeatherIcon('unknown'), bundledWeatherIcon('exceptional'));
assert.equal(bundledWeatherIcon('cloudy', 'above_horizon', 'unknown'), bundledWeatherIcon('cloudy', 'above_horizon', 'style1'));
console.log('Bundled icon coverage, day/night variants and fallback assets verified');
