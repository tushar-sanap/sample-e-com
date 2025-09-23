const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-15', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      document.addEventListener('click', e => { e.stopImmediatePropagation(); }, { capture: true });
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-15 Test', async () => {
    await commands.driver.executeScript(`
      const b = document.createElement('button');
      b.id = 'tbtn';
      b.textContent = 'go';
      b.addEventListener('click', () => { window.__clicked = true; });
      document.body.appendChild(b);
    `);
    await commands.click('#tbtn');
    const v = await commands.driver.executeScript('return !!window.__clicked');
    expect(v).to.equal(true);
  });
});
