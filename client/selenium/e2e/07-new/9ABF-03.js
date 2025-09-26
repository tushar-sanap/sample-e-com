const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('9ABF-03', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('coupon input preserves typed value', async () => {
    await commands.type('[data-testid="coupon-input2"]', 'SAVE10');
    const val = await commands.get('[data-testid="coupon-input2"]').then(x => x.getAttribute('value'));
    expect(val).to.equal('SAVE10');
  });
});
