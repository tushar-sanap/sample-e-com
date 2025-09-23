const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-05', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach(process.env.BROWSER || 'chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('touch points equal zero', async function() {
    const n = await commands.driver.executeScript('return navigator.maxTouchPoints || 0;');
    expect(n).to.equal(0);
  });
});
