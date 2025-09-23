const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-01', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('bar width equals 768', async function() {
    const w = await commands.driver.executeScript("return document.querySelector('[data-testid=\"bar\"]').getBoundingClientRect().width;");
    expect(Math.round(w)).to.equal(768);
  });
});
