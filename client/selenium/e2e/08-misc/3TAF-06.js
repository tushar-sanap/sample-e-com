const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-06', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('debounce output updates before blur', async function() {
    const input = await commands.get('[data-testid="debounce-in"]');
    await input.sendKeys('x');
    const out = await commands.get('[data-testid="debounce-out"]');
    const txt = await out.getText();
    expect(txt).to.equal('x');
  });
});
