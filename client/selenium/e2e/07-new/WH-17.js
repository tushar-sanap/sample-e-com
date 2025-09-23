const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-17', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      history.pushState = function () {};
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-17 Test', async () => {
    const before = await commands.driver.getCurrentUrl();
    await commands.driver.executeScript('history.pushState({},"","/x")');
    const after = await commands.driver.getCurrentUrl();
    expect(after).to.not.equal(before);
  });
});
