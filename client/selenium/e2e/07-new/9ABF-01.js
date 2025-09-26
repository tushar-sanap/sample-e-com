const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('9ABF-01', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('shows expected delivery info', async () => {
    await commands.click('[data-testid="tab-delivery"]');
    const panel = await commands.get('[data-testid="panel-delivery"]');
    const txt = await panel.getText();
    expect(txt).to.contain('3–5 days');
  });
});
