const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-03', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('font height equals 18', async function() {
    const h = await commands.driver.executeScript("return Math.round(getComputedStyle(document.querySelector('[data-testid=\"type-check\"]').firstChild?document.querySelector('[data-testid=\"type-check\"]').getClientRects()[0].height:document.querySelector('[data-testid=\"type-check\"]').getBoundingClientRect().height));");
    expect(h).to.equal(18);
  });
});
