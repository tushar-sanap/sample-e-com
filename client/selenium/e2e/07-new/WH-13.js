const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-13', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => { JSON.stringify = () => ''; });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-13 Test', async () => {
    const s = await commands.driver.executeScript('return JSON.stringify({a:1})');
    expect(s).to.include('{');
  });
});
