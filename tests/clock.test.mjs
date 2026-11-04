import assert from 'node:assert/strict';
import {clockDisplay} from '../src/clock.js';

const wrongDeviceDate = new Date('2000-01-01T01:02:03Z');
const hass = {config: {time_zone: 'Europe/Berlin'}, states: {}};
const config = {time_entity: 'sensor.clock', show_time_seconds: true};
function read(state, extra = {}, options = {}) {
  hass.states['sensor.clock'] = {state, last_updated:'2026-11-04T12:34:56Z', ...extra};
  return clockDisplay(hass, {...config, ...options}, 'de-DE', wrongDeviceDate);
}
assert.deepEqual(read('2026-11-04T12:34:56Z'), {time:'13:34:56', day:'Mittwoch', date:'4. November'});
assert.deepEqual(read('2026-11-04T13:34:56+01:00'), read('2026-11-04T12:34:56Z'));
assert.equal(read('2026-07-04T12:00:00Z').time,'14:00:00'); // summer time
assert.equal(read('2026-03-29T00:30:00Z').time,'01:30:00');
assert.equal(read('2026-03-29T01:30:00Z').time,'03:30:00'); // DST jump
assert.equal(read('2026-11-04T23:30:00Z').date,'5. November');
assert.equal(read('2026-11-04T23:30:00Z').day,'Donnerstag');
for (const state of ['2026-11-04 13:34:56','2026-11-04, 13:34:56','13:34:56, 2026-11-04']) {
  assert.deepEqual(read(state),{time:'13:34:56',day:'Mittwoch',date:'4. November'});
}
assert.deepEqual(read('13:34'),{time:'13:34:00',day:'Mittwoch',date:'4. November'});
assert.equal(read('13:34:56').time,'13:34:56');
assert.equal(read('00:05', {last_updated:'2026-11-04T23:05:00Z'}).date,'5. November');
assert.deepEqual(read('13:34',{last_updated:null}),{time:'13:34:00',day:'–',date:'–'});
assert.equal(read('13:34',{}, {show_time_seconds:false}).time,'13:34');
assert.match(read('13:34',{}, {use_12hour_format:true}).time,/1:34:00/);
for (const state of ['unknown','unavailable','','garbage','24:00','12:60','12:00:60','2026-02-30 12:00','2026-02-30T12:00:00Z','2026-13-01 12:00']) {
  assert.deepEqual(read(state),{time:'–',day:'–',date:'–'},state);
}
delete hass.states['sensor.clock'];
assert.deepEqual(clockDisplay(hass,config,'de-DE',wrongDeviceDate),{time:'–',day:'–',date:'–'});
const device = clockDisplay(hass,{show_time_seconds:true},'de-DE',wrongDeviceDate);
assert.equal(device.time,wrongDeviceDate.toLocaleTimeString('de-DE',{hour12:false,hour:'numeric',minute:'numeric',second:'numeric'}));
assert.equal(device.date,wrongDeviceDate.toLocaleDateString('de-DE',{month:'long',day:'numeric'}));
hass.config.time_zone = 'invalid/timezone';
assert.equal(read('2026-11-04T12:34:56Z').time,'12:34:56');
console.log('HA clock sources, wrong device date, timezone/DST and unavailable-state tests passed');
