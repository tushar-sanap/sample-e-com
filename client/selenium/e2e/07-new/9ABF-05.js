const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('9ABF-05', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('high-to-low puts the highest price first', async () => {
    const select = await commands.get('[data-testid="sort-select"]');
    await select.sendKeys('Price: High to Low');
    await commands.wait(500);

    const firstPriceEl = (await commands.getAll('[data-testid="product-price"]'))[0];
    const firstTxt = await firstPriceEl.getText();
    expect(firstTxt).to.contain('499');
  });
});
