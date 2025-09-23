const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-10-sort', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async () => { await testSetup.afterEach(); });

  it('places highest price first with High to Low', async () => {
    await commands.visit('/flaky-lab');
    const select = await commands.get('[data-testid="sort-select"]');
    await select.sendKeys('Price: High to Low');
    await commands.wait(400);
    const first = await commands.getAll('[data-testid="product-price"]').then(els => els[0].getText());
    expect(first.trim()).to.equal('$499.00');
  });
});
