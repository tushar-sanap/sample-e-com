const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-10', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('Visual Test 10', async function () {
    await commands.visit('/experience');
    await commands.click('[data-testid="primary-action-btn"]');
    await commands.wait(200);
    const out = await commands.get('[data-testid="action-result"]').then(e => e.getText());
    expect(out).to.equal('Done');
  });
});
