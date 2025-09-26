const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');
describe('4BDCF-09', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });
  it('offscreen canvas absent', async function() {
    const ok = await commands.driver.executeScript('return typeof OffscreenCanvas');
    expect(ok).to.equal('undefined');
  });
});
