const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-04', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach(process.env.BROWSER || 'chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('backdrop layer has no blur', async function() {
    const v = await commands.driver.executeScript(`var e=document.querySelector('[data-testid="fx-layer"]'); return getComputedStyle(e).backdropFilter || getComputedStyle(e).webkitBackdropFilter;`);
    expect(v).to.equal('none');
  });
});
