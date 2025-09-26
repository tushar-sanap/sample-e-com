const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('9ABF-02', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('updates total after adding multiple items', async () => {
    await commands.click('[data-testid="add-btn-1"]');
    await commands.click('[data-testid="add-btn-3"]');
    await commands.wait(300);
    const totalText = await commands.get('[data-testid="grand-total"]').then(x => x.getText());
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    expect(total).to.be.greaterThan(600);
  });
});
