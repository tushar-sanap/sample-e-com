const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');
describe('4BDCF-08', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });
  it('user agent data missing', async function() {
    const t = await commands.driver.executeScript('return typeof navigator.userAgentData');
    expect(t).to.equal('undefined');
  });
});
