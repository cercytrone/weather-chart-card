import assert from 'node:assert/strict';
import {forecastGeometry, numeric, extendedGeometry, curvePoints, forecastWindow} from '../src/modern-layout.js';

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

// Visible columns keep their centres; only unlabelled paths extend to the edges.
const visible = [{temperature: 10, templow: 2}, {temperature: 12, templow: 4}];
const flat = extendedGeometry(visible);
const flatHigh = curvePoints(flat, 'high');
assert.deepEqual(flat.points.map(p => p.x), [25, 75]);
assert.deepEqual(flatHigh.map(p => p.x), [0, 25, 75, 100]);
assert.equal(flatHigh[0].highY, flat.points[0].highY);
assert.equal(flatHigh[3].highY, flat.points[1].highY);
const neighbours = extendedGeometry(visible, {temperature: 8}, {temperature: 16, templow: 6});
assert.deepEqual(curvePoints(neighbours, 'high').map(p => p.x), [-25, 25, 75, 125]);
// Missing low in the previous neighbour falls back independently of the high.
assert.equal(curvePoints(neighbours, 'low')[0].x, 0);
assert.equal(curvePoints(neighbours, 'low').slice(-1)[0].x, 125);
const gap = extendedGeometry([{temperature: null}, {temperature: 10}, {temperature: null}], {temperature: 5}, {temperature: 12});
assert.deepEqual(curvePoints(gap, 'high').map(p => p.highY === null), [true, false, true]);
assert.deepEqual(curvePoints(extendedGeometry([]), 'high'), []);
assert.deepEqual(curvePoints(extendedGeometry([{temperature: 0}]), 'high').map(p => p.x), [0,50,100]);
const source = Array.from({length:8}, (_, i) => ({datetime:new Date(i*86400000).toISOString(),temperature:i}));
const window = forecastWindow(source, 3, 86400000, true, 3*86400000);
assert.deepEqual(window.items, source.slice(2,5));
assert.equal(window.previous,source[1]);
assert.equal(window.next,source[5]);
const firstWindow = forecastWindow(source, 5, 86400000, false);
assert.equal(firstWindow.previous,null);
assert.equal(firstWindow.next,source[5]);
const lastWindow = forecastWindow(source, 20, 86400000, false);
assert.equal(lastWindow.next,null);
assert.deepEqual(forecastWindow([],5,1,true), {items:[],previous:null,next:null});
console.log('Chart edge continuation and neighbour selection tests passed');
