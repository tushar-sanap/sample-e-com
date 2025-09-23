const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-16', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      const o = {};
      Object.freeze(o);
      window.__bag = o;
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-16 Test', async () => {
    await commands.driver.executeScript('window.__bag.x = 1');
    const v = await commands.driver.executeScript('return window.__bag.x');
    expect(v).to.equal(1);
  });
});
