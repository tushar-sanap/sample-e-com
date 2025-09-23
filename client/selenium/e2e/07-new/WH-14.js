const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-14', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => { performance.now = () => 0; });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-14 Test', async () => {
    const a = await commands.driver.executeScript('return performance.now()');
    await commands.wait(120);
    const b = await commands.driver.executeScript('return performance.now()');
    expect(b - a).to.be.greaterThan(0);
  });
});
