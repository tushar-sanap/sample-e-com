const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-04', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('lazy text is present without delay', async function() {
    const el = await commands.get('[data-testid="late"]');
    const txt = await el.getText();
    expect(txt).to.equal('loaded');
  });
});
