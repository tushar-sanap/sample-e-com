const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-12', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      const orig = localStorage.setItem.bind(localStorage);
      Object.defineProperty(localStorage, 'setItem', { value: function () { throw new Error('x'); } });
      window.__ls_orig = orig;
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-12 Test', async () => {
    await commands.driver.executeScript('localStorage.setItem("k","v")');
    const got = await commands.driver.executeScript('return localStorage.getItem("k")');
    expect(got).to.equal('v');
  });
});
