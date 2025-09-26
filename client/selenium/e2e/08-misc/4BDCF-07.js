const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');
describe('4BDCF-07', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });
  it('selector has unsupported', async function() {
    const ok = await commands.driver.executeScript('return CSS && CSS.supports && CSS.supports("selector(:has(div))")');
    expect(Boolean(ok)).to.equal(false);
  });
});
