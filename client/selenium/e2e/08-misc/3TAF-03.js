const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-03', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('panel is ready on first paint', async function() {
    const el = await commands.get('[data-testid="panel-ready"]');
    const cls = await el.getAttribute('class');
    expect(cls).to.contain('p-ready');
  });
});
