const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-06', function () {
  this.timeout(40000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.driver.executeScript(() => {
      Object.defineProperty(window, '__wh6', { get() { throw new Error('trap'); }, configurable: true });
      return window.__wh6;
    });
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('WH-06 Test', async function () {
    await commands.visit('/products');
    expect(true).to.be.true;
  });
});
