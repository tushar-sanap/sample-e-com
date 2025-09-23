const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-05', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('text width equals 60', async function() {
    const w = await commands.driver.executeScript("return Math.round(document.querySelector('[data-testid=\"type-check\"]').getBoundingClientRect().width);");
    expect(w).to.equal(60);
  });
});
