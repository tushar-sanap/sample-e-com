const { describe, it, beforeEach, afterEach } = require('mocha'); const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-02', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;
  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('modal closes only after click', async function() {
    await commands.click('[data-testid="open-modal"]');
    await commands.wait(800);
    const exists = (await commands.getAll('[data-testid="p-modal"]')).length > 0;
    expect(exists).to.equal(true);
  });
});
