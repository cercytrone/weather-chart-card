import assert from 'node:assert/strict';
import {forecastGeometry, numeric} from '../src/modern-layout.js';

for (const value of [null, undefined, '', 'unknown', 'unavailable', NaN, Infinity]) assert.equal(numeric(value), null);
assert.equal(numeric(0), 0);
assert.equal(numeric('-7.5'), -7.5);
assert.deepEqual(forecastGeometry([]), []);
for (const input of [
  [{temperature: 0, templow: 0}],
  [{temperature: -20, templow: -30}, {temperature: 40}],
  [{}, {temperature: null, templow: 'unavailable'}],
]) {
  for (const point of forecastGeometry(input)) {
    assert.ok(point.x > 0 && point.x < 100);
    for (const key of ['highY', 'lowY']) {
      assert.ok(point[key] === null || (point[key] >= 32 && point[key] <= 132));
    }
  }
}
const points = forecastGeometry([{temperature: 10}, {temperature: null, templow: 0}, {temperature: 20}]);
assert.equal(points[1].highY, null);
assert.equal(points[0].lowY, null);
console.log('Modern layout geometry and missing-value tests passed');
