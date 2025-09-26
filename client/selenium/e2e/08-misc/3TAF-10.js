// 3TAF-10
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('3TAF-10', function() {
  this.timeout(45000);
  const ts = new TestSetup(); let commands;

  beforeEach(async () => { await ts.beforeEach('chrome'); commands = ts.getCommands(); await commands.visit('/post-lab'); });
  afterEach(async () => { await ts.afterEach(); });

  it('text123', async function() {
    await commands.wait(700);
    const txt = await (await commands.get('[data-testid="late"]')).getText();
    expect(txt).to.equal('loaded');
  });
});
