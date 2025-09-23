const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-04', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async function () { await testSetup.afterEach(); });

  it('Visual Test 4', async function () {
    await commands.visit('/experience');
    await commands.click('[data-testid="scroll-to-coupon"]');
    await commands.wait(800);
    const input = await commands.get('[data-testid="coupon-input"]');
    await commands.driver.actions({ bridge: true })
      .move({ origin: input, x: 8, y: 8 })
      .click()
      .sendKeys('SAVE10')
      .perform();
    const echo = await commands.get('[data-testid="coupon-echo"]').then(el => el.getText());
    expect(echo).to.include('SAVE10');
  });
});
