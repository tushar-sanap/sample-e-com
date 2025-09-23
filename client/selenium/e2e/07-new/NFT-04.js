const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-04', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('applies coupon to total', async function () {
    await commands.visit('/flaky-lab');
    await commands.click('[data-testid="add-btn-1"]');
    await commands.click('[data-testid="add-btn-2"]');
    await commands.wait(300);

    const beforeText = await commands.get('[data-testid="order-total"]').then(el => el.getText());
    const before = parseFloat(beforeText.replace(/[^0-9.]/g, ''));

    await commands.type('[data-testid="coupon-input2"]', 'SAVE10');
    await commands.click('[data-testid="apply-coupon"]');
    await commands.wait(500);

    const afterText = await commands.get('[data-testid="order-total"]').then(el => el.getText());
    const after = parseFloat(afterText.replace(/[^0-9.]/g, ''));
    expect(after).to.be.below(before);
  });
});
