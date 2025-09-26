// 3TAF-08
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-08', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('data load', async function() {
    await commands.click('[data-testid="load-data"]');
    const txt = await (await commands.get('[data-testid="net-data"]')).getText();
    expect((txt || '').length).to.be.greaterThan(0);
  });
});
