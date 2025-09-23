const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-05', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('animation finished instantly', async function() {
    await commands.click('[data-testid="run-anim"]');
    const state = await (await commands.get('[data-testid="anim-state"]')).getText();
    expect(state).to.equal('done');
  });
});
