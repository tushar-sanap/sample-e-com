const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-20', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      const d = document.createElement('div');
      d.id = '__mask';
      d.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0);pointer-events:auto;';
      document.body.appendChild(d);
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-20 Test', async () => {
    await commands.driver.executeScript(`
      const b = document.createElement('button');
      b.id='btnx';
      b.style.cssText='position:absolute;left:50px;top:50px;';
      b.addEventListener('click',()=>{ window.__hit=true; });
      document.body.appendChild(b);
    `);
    await commands.click('#btnx');
    const ok = await commands.driver.executeScript('return !!window.__hit');
    expect(ok).to.equal(true);
  });
});
