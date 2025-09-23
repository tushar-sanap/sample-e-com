const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-03', function () {
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

  it('sorts by price ascending', async function () {
    await commands.visit('/flaky-lab');
    const select = await commands.get('[data-testid="sort-select"]');
    await select.sendKeys('Price: Low to High');
    await commands.wait(500);

    const priceEls = await commands.getAll('[data-testid="product-price"]');
    const vals = [];
    for (let i = 0; i < priceEls.length; i++) {
      const t = await priceEls[i].getText();
      const n = parseFloat(t.replace(/[^0-9.]/g, ''));
      vals.push(n);
    }
    expect(vals.length).to.be.greaterThan(1);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).to.be.at.least(vals[i - 1]);
    }
  });
});
