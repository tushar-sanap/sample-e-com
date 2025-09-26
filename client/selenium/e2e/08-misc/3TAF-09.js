// 3TAF-09
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-09', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('modal status', async function() {
    await commands.click('[data-testid="open-modal"]');
    await commands.wait(600);
    const present = (await commands.getAll('[data-testid="p-modal"]')).length > 0;
    expect(present).to.equal(false);
  });
});
