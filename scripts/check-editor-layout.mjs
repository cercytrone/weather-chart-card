/** Browser regression checks. Run: node scripts/capture-docs.mjs --test-editor */
import assert from 'node:assert/strict';

export async function checkEditorLayout(page) {
  await page.evaluate(() => {
    // Representative HA shell dimensions; not a replacement for testing in live HA.
    for (const [tag, width] of [['ha-switch',44],['ha-checkbox',40]]) {
      if (!customElements.get(tag)) customElements.define(tag,class extends HTMLElement {
        constructor(){super();this.attachShadow({mode:'open'}).innerHTML=`<style>:host{display:inline-flex;flex-shrink:0;width:${width}px;height:32px;align-items:center}input{margin:0;width:100%;accent-color:var(--primary-color)}</style><input type="checkbox" aria-label="Demo control">`;}
      });
    }
    if (!customElements.get('ha-select')) customElements.define('ha-select',class extends HTMLElement {
      connectedCallback(){this.attachShadow({mode:'open'}).innerHTML='<style>:host{display:block;min-width:0;max-width:100%;padding:12px;border:1px solid var(--divider-color);border-radius:6px;box-sizing:border-box}</style>';this.shadowRoot.append(document.createTextNode(this.getAttribute('label') || 'Select'));}
    });
    document.querySelector('#card-demo').hidden = true;
    document.querySelector('#editor-demo').hidden = false;
    document.querySelector('#editor-demo h1').textContent = 'Visual editor · Main · layout regression demo';
    document.body.style.padding = '8px';
    document.querySelector('#editor-demo').style.cssText = 'width:100%;padding:12px;box-sizing:border-box';
    const id = 'sensor.' + 'very_long_home_assistant_time_entity_id_'.repeat(6);
    window.clockTestId = id;
    editor.hass = {...hass, states:{...hass.states,[id]:{state:'13:00',attributes:{friendly_name:'Long friendly name for an offline Fire tablet clock '.repeat(8)}}}};
    editor.setConfig({...config,time_entity:id,animated_icons:true});
  });
  const failures = [];
  for (const layout of ['modern','classic']) {
    await page.evaluate(layout => editor.setConfig({...editor.config,layout}),layout);
    for (const theme of ['light','dark']) {
      await page.evaluate(theme => document.body.classList.toggle('dark',theme === 'dark'),theme);
      for (const width of [280,320,480,620]) {
        await page.setViewportSize({width,height:1600});
        for (const tab of ['card','modern','forecast','units','alternate']) {
          await page.evaluate(async tab => {editor.showPage(tab);await editor.updateComplete;},tab);
          const overflow = await page.evaluate(() => {
            const right = editor.getBoundingClientRect().right;
            const issues = [...editor.shadowRoot.querySelectorAll('select,input,fieldset,label,legend,button,p,ha-switch,ha-checkbox,ha-textfield,ha-select,.time-container,.icon-container,.flex-container,.native-switch-row')]
              .filter(el => el.getClientRects().length && el.getBoundingClientRect().right > right + 1)
              .map(el => `${el.id || el.className || el.tagName}: ${Math.round(el.getBoundingClientRect().right)} > ${Math.round(right)}`);
            if (editor.scrollWidth > editor.clientWidth + 1) issues.push(`Editor scroll width: ${editor.scrollWidth} > ${editor.clientWidth}`);
            if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('Document overflows the viewport');
            return issues;
          });
          if (overflow.length) failures.push({layout,theme,width,tab,overflow});
        }
      }
    }
  }
  await page.setViewportSize({width:480,height:1600});
  await page.evaluate(async () => {document.body.classList.remove('dark');editor.showPage('card');await editor.updateComplete;});
  await page.locator('#editor-demo').screenshot({path:'/tmp/weather-editor-layout.png'});
  assert.deepEqual(failures,[], 'Editor controls must stay inside the available width');
  await page.evaluate(async () => {
    const select = editor.shadowRoot.querySelector('#time-entity');
    if (select.value !== window.clockTestId) throw new Error('Clock source was lost');
    select.value = '';
    select.dispatchEvent(new Event('change'));
    await editor.updateComplete;
    if (editor.config.time_entity !== '') throw new Error('Clearing the clock source failed');
    select.value = window.clockTestId;
    select.dispatchEvent(new Event('change'));
    await editor.updateComplete;
    if (editor.config.time_entity !== window.clockTestId) throw new Error('Selecting the clock source failed');
  });
  console.log('Editor layout passed: long entity names, 280/320/480/620px, light/dark, both layouts, five tabs, source selection/reset. Screenshot: /tmp/weather-editor-layout.png');
}
