import assert from 'node:assert/strict';
import {forecastGeometry, numeric, extendedGeometry, curvePoints, forecastWindow, temperatureColor, precipitationData} from '../src/modern-layout.js';

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

// Colours use absolute temperatures, not the current forecast's min/max.
assert.equal(temperatureColor(0), 'rgb(56, 189, 248)');
assert.equal(temperatureColor(20), 'rgb(132, 204, 22)');
assert.equal(temperatureColor(40), 'rgb(239, 68, 68)');
assert.equal(temperatureColor(-100), temperatureColor(-10));
assert.equal(temperatureColor(100), temperatureColor(40));
assert.equal(temperatureColor(5), 'rgb(51, 201, 220)');
for (const value of [null, undefined, '', 'unavailable', Infinity]) assert.equal(temperatureColor(value), null);
for (const celsius of [-10, 0, 10, 20, 30, 40]) {
  assert.equal(temperatureColor(celsius * 9 / 5 + 32, '°F'), temperatureColor(celsius));
  assert.equal(temperatureColor(celsius + 273.15, 'K'), temperatureColor(celsius));
}
console.log('Temperature palette and unit conversion tests passed');

const rainfall = precipitationData([{precipitation:0.4},{precipitation:0.3},{precipitation:1},{precipitation:0},{},{precipitation:-1}]);
assert.deepEqual(rainfall.values,[0.4,0.3,1,0,null,null]);
assert.deepEqual(rainfall.heights,[40,30,100,0,0,0]);
assert.equal(rainfall.maximum,1);
assert.deepEqual(precipitationData([{precipitation:0}]).heights,[0]);
assert.equal(precipitationData([]).maximum,0);
assert.deepEqual(precipitationData([{precipitation:'unavailable'},{precipitation:null}]).values,[null,null]);
const probability = precipitationData([{precipitation_probability:25},{precipitation_probability:50},{precipitation_probability:100},{precipitation_probability:101},{precipitation_probability:-1}], 'probability');
assert.equal(probability.maximum,100);
assert.deepEqual(probability.values,[25,50,100,null,null]);
assert.deepEqual(probability.heights,[25,50,100,0,0]);
assert.equal(precipitationData([{precipitation:0.4}]).heights[0],100);
console.log('Precipitation scaling, probabilities, zero and missing-value tests passed');
