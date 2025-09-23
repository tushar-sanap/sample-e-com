const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('8VRF-04', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('ball final x equals 200', async function() {
    await commands.click('[data-testid="run-anim"]');
    await commands.wait(300);
    const x = await commands.driver.executeScript("return Math.round(document.querySelector('[data-testid=\"ball\"]').getBoundingClientRect().left);");
    expect(x).to.equal(200);
  });
});
