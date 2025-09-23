const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-08-coupon', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async () => { await testSetup.afterEach(); });

  it('applies SAVE10 correctly', async () => {
    await commands.visit('/flaky-lab');
    await commands.click('[data-testid="add-btn-1"]');
    await commands.click('[data-testid="add-btn-2"]');
    await commands.wait(150);
    await commands.type('[data-testid="coupon-input2"]', 'SAVE10');
    await commands.click('[data-testid="apply-coupon"]');
    await commands.wait(200);
    const txt = await commands.get('[data-testid="grand-total"]').then(x => x.getText());
    expect(txt.replace(/[^\d.]/g, '')).to.equal('268.20');
  });
});
