// 3TAF-07
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-07', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('net ping', async function() {
    const txt = await (await commands.get('[data-testid="net-ping"]')).getText();
    expect((txt || '').length).to.be.greaterThan(0);
  });
});
