/** Render the real branch bundle with deterministic demo data and small HA shell stubs.
 * Optional tools: npm install --no-save playwright-core@1.64.1 @sparticuz/chromium@153.0.0
 * Run after npm run build: node scripts/capture-docs.mjs
 * No Home Assistant server or external network is used. */
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {chromium as playwright} from 'playwright-core';
import chromium from '@sparticuz/chromium';
import * as mdi from '@mdi/js';
const root = new URL('../', import.meta.url);
const icons = Object.fromEntries(Object.entries(mdi).filter(([key]) => key.startsWith('mdi')).map(([key,value]) => [key.slice(3).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).slice(1),value]));
const html = `<!doctype html><html lang="de"><meta charset="utf-8"><title>Weather Chart Card · documentation demo</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;font-family:Arial,sans-serif;background:var(--demo-background);color:var(--primary-text-color)}
body{--demo-background:#f3f5f8;--card-background-color:#fff;--primary-text-color:#17202e;--secondary-text-color:#637084;--divider-color:#e1e6ed;--primary-color:#0288d1;--disabled-color:#8794a5;--paper-item-icon-color:#637084}
body.dark{--demo-background:#0b0f17;--card-background-color:#181e2b;--primary-text-color:#f1f5f9;--secondary-text-color:#94a3b8;--divider-color:#ffffff13;--primary-color:#38bdf8;--paper-item-icon-color:#94a3b8}
#card-demo{width:430px;padding:18px;background:var(--demo-background);border-radius:16px}#editor-demo{width:620px;padding:20px;background:var(--card-background-color);border-radius:16px}h1{font-size:17px;margin:0 0 14px}.caption{font-size:11px;line-height:1.5;color:var(--secondary-text-color);margin:14px 0 0}#card-demo h1{font-size:12px;color:var(--secondary-text-color);font-weight:400}
</style><body><div id="card-demo"><h1>Weather Chart Card · Modern</h1><div id="card-slot"></div><p class="caption">Browser-Vorschau · Beispieldaten, keine Live-Wetterdaten</p></div><div id="editor-demo" hidden><h1>Visueller Editor · Modern</h1><div id="editor-slot"></div><p class="caption">Original-Karteneditor · HA-Basiskomponenten lokal nachgebildet</p></div>
<script>
const iconPaths=${JSON.stringify(icons)};
customElements.define('ha-card',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'})}connectedCallback(){this.update()}set header(value){this._header=value;this.update()}get header(){return this._header||this.getAttribute('header')||''}update(){this.shadowRoot.innerHTML='<style>:host{display:block;position:relative;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}h2{font-size:24px;font-weight:400;line-height:1.2;margin:0;padding:24px 16px 16px}</style>'+(this.header?'<h2></h2>':'')+'<slot></slot>';const h=this.shadowRoot.querySelector('h2');if(h)h.textContent=this.header}});
customElements.define('ha-icon',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'})}set icon(value){this._icon=value;this.update()}get icon(){return this._icon||this.getAttribute('icon')}static get observedAttributes(){return ['icon']}attributeChangedCallback(){this.update()}connectedCallback(){this.update()}update(){const path=iconPaths[(this.icon||'').split(':').pop()]||iconPaths['help-circle-outline'];this.shadowRoot.innerHTML='<style>:host{display:inline-flex;vertical-align:middle;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24"><path d="'+path+'"/></svg>'}});
customElements.define('ha-textfield',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'})}connectedCallback(){this.shadowRoot.innerHTML='<style>:host{display:block}label{display:grid;gap:5px;font-size:13px}input{padding:10px;font:inherit;border:1px solid var(--divider-color);border-radius:6px;background:var(--card-background-color);color:var(--primary-text-color)}</style><label></label>';const label=this.shadowRoot.querySelector('label');label.textContent=this.getAttribute('label')||'';const input=document.createElement('input');input.value=this.value||'';label.append(input)}});
</script><script src="/weather-chart-card.js"></script><script>
const date='2026-10-27';const forecasts=[14,16,12,10,13,15].map((temperature,i)=>({datetime:new Date(Date.UTC(2026,9,27+i,12)).toISOString(),temperature,templow:[6,8,5,2,7,9][i],condition:['partlycloudy','rainy','sunny','pouring','cloudy','sunny'][i],precipitation:[0.4,1.8,0,4.2,null,0.2][i],wind_speed:[12,18,10,22,14,9][i],wind_bearing:[90,120,180,250,300,40][i]}));
const weather={state:'partlycloudy',last_updated:date+'T11:58:00Z',attributes:{friendly_name:'Berlin (Demo)',temperature:19.7,temperature_unit:'°C',humidity:75,pressure:1017,pressure_unit:'hPa',wind_speed:12,wind_speed_unit:'km/h',wind_bearing:90,uv_index:2.4,precipitation_unit:'mm',supported_features:3}};
const hass={language:'de',selectedLanguage:'de',states:{'weather.home':weather,'sun.sun':{state:'above_horizon',attributes:{next_rising:date+'T06:30:00Z',next_setting:date+'T15:42:00Z'}}},config:{unit_system:{temperature:'°C',length:'km'}},connection:{subscribeMessage:async callback=>{queueMicrotask(()=>callback({forecast:forecasts}));return ()=>{}}}};
const config={entity:'weather.home',layout:'modern',title:'Wetter zuhause',locale:'de',show_time:true,show_day:true,show_date:true,show_last_changed:true,center_weather_icon:true,modern_padding_top:8,modern_padding_bottom:12,time_size:26,day_size:13,date_size:13,current_temp_size:36,current_icon_size:48,attribute_icon_size:16,forecast:{type:'daily',number_of_forecasts:5,round_temp:true,temperature_gradient:true,gradient_fill:true,night_dotted:true,precipitation_style:'bars',precipitation_height:40}};
window.card=document.createElement('weather-chart-card');card.setConfig(config);card.hass=hass;document.querySelector('#card-slot').append(card);window.editor=document.createElement('weather-chart-card-editor');editor.hass=hass;editor.setConfig(config);editor.showPage('modern');document.querySelector('#editor-slot').append(editor);
</script></body></html>`;
const server = createServer(async(req,res)=>{try{if(req.url==='/weather-chart-card.js'){res.setHeader('Content-Type','text/javascript');res.end(await readFile(new URL('dist/weather-chart-card.js',root)));}else{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);}}catch(error){res.writeHead(500);res.end(String(error));}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  const browserEnvironment={...process.env};
  if(process.platform==='linux') {
    const libraries=join(tmpdir(),'weather-docs-browser-libs');
    await mkdir(libraries,{recursive:true});
    const archive=join(libraries,'libraries.tar');
    await writeFile(archive,brotliDecompressSync(await readFile(new URL('../bin/al2023.tar.br',import.meta.resolve('@sparticuz/chromium')))));
    execFileSync('tar',['xf',archive,'-C',libraries]);
    browserEnvironment.LD_LIBRARY_PATH=[join(libraries,'lib'),tmpdir(),process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
  }
  browser=await playwright.launch({env:browserEnvironment,executablePath:await chromium.executablePath(),args:[...chromium.args.filter(arg=>!arg.includes('in-process-gpu')&&!arg.includes('use-gl=')&&!arg.includes('use-angle=')), '--disable-gpu'],headless:true});
  const page=await browser.newPage({viewport:{width:1000,height:1200},deviceScaleFactor:2,timezoneId:'Europe/Berlin',locale:'de-DE'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{const OriginalDate=Date;const now=OriginalDate.parse('2026-10-27T12:00:00Z');window.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}});
  await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.card?.shadowRoot?.querySelectorAll('.precip-column').length===5);
  await mkdir(new URL('docs/screenshots/',root),{recursive:true});
  for(const theme of ['light','dark']){
    await page.evaluate(theme=>document.body.classList.toggle('dark',theme==='dark'),theme);
    await page.locator('#card-demo').screenshot({path:new URL(`docs/screenshots/modern-${theme}.png`,root).pathname});
  }
  await page.evaluate(()=>{document.body.classList.remove('dark');document.querySelector('#card-demo h1').textContent='Weather Chart Card · Classic';card.setConfig({...card.config,layout:'classic',show_time:false,show_day:false,show_date:false,current_temp_size:28,forecast:{...card.config.forecast,style:'style2',disable_animation:true}})});
  await page.waitForFunction(()=>card.forecastChart && card.shadowRoot.querySelector('canvas'));
  await page.evaluate(()=>{card.measureCard();card.forecastChart.update('none')});
  await page.locator('#card-demo').screenshot({path:new URL('docs/screenshots/classic-light.png',root).pathname});
  await page.setViewportSize({width:1000,height:3000});
  await page.evaluate(()=>{document.body.classList.remove('dark');document.querySelector('#card-demo').hidden=true;document.querySelector('#editor-demo').hidden=false;editor.showPage('modern')});
  await page.waitForFunction(()=>editor.shadowRoot.querySelector('[data-page="modern"]').classList.contains('active'));
  // Capture the real settings navigation and active Modern page, excluding unrelated global controls.
  const clip=await page.evaluate(()=>{const outer=document.querySelector('#editor-demo').getBoundingClientRect();const top=editor.shadowRoot.querySelector('.buttons-container').getBoundingClientRect();const bottom=editor.shadowRoot.querySelector('[data-page="modern"]').getBoundingClientRect();return {x:outer.x,y:top.y-12,width:outer.width,height:bottom.bottom-top.y+32}});
  await page.screenshot({path:new URL('docs/screenshots/editor-modern.png',root).pathname,clip});
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('Rendered Modern light/dark, Classic and Modern editor screenshots from dist/weather-chart-card.js');
}finally{await browser?.close();server.close();}
