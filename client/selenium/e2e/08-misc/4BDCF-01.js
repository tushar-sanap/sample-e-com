const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-01', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach(process.env.BROWSER || 'chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('clamp box shows two lines', async function() {
    const el = await commands.get('[data-testid="clamp-box"]');
    const h = await commands.driver.executeScript('return arguments[0].getBoundingClientRect().height', el);
    expect(Math.round(h)).to.be.greaterThan(30);
  });
});
