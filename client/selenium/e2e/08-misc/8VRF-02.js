const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-02', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('grid gap equals 8', async function() {
    const v = await commands.driver.executeScript("return parseInt(getComputedStyle(document.querySelector('[data-testid=\"grid\"]').children[1]).marginLeft||'0',10)||0;");
    expect(v).to.equal(8);
  });
});
