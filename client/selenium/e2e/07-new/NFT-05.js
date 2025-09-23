const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-05', function () {
  this.timeout(45000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    const browser = process.env.BROWSER || 'chrome';
    let lastErr;
    for (let i = 0; i < 2; i++) {
      try {
        await testSetup.beforeEach(browser);
        commands = testSetup.getCommands();
        await commands.visit('/flaky-lab');
        await commands.driver.executeScript('try{sessionStorage.clear();localStorage.clear();}catch(e){}');
        return;
      } catch (e) {
        lastErr = e;
        await new Promise(r => setTimeout(r, 800));
      }
    }
    throw lastErr;
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('shows pickup panel', async function () {
    await commands.click('[data-testid="tab-pickup"]');
    let visible = false;
    for (let i = 0; i < 20; i++) {
      const panel = await commands.get('[data-testid="panel-pickup"]');
      const klass = await panel.getAttribute('class');
      if (!klass || !/hidden/.test(klass)) { visible = true; break; }
      await commands.wait(100);
    }
    expect(visible).to.equal(true);
  });
});
