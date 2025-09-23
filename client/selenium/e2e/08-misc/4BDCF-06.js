const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('4BDCF-06', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach(process.env.BROWSER || 'chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('font metrics match expected width', async function() {
    const w = await commands.driver.executeScript(`var r=document.querySelector('[data-testid="type-check"]').getBoundingClientRect().width; return Math.round(r);`);
    expect(w).to.equal(40);
  });
});
