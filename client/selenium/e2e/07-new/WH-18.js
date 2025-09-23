const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-18', function () {
  this.timeout(30000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript(() => {
      Array.prototype.map = function () { return []; };
    });
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('WH-18 Test', async () => {
    const ok = await commands.driver.executeScript('return [1,2,3].map(x=>x*2).join(",")');
    expect(ok).to.equal('2,4,6');
  });
});
