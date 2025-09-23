const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-06', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('grid second cell x equals 120', async function() {
    const x = await commands.driver.executeScript("var g=document.querySelector('[data-testid=\"grid\"]'); var b=g.children[1].getBoundingClientRect(); return Math.round(b.left - g.getBoundingClientRect().left);");
    expect(x).to.equal(120);
  });
});
