const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-01', function () {
  this.timeout(45000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
    await commands.driver.executeScript('try { sessionStorage.clear(); localStorage.clear(); } catch(e) {}');
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('filters discounted items', async function () {
    let tries = 0, before = [];
    while (tries++ < 20) {
      before = await commands.getAll('[data-testid="product-card"]');
      if (before.length) break;
      await commands.wait(100);
    }
    expect(before.length).to.equal(3);

    await commands.click('[data-testid="discount-toggle"]');

    let afterCount = 0, spins = 0;
    while (spins++ < 20) {
      afterCount = (await commands.getAll('[data-testid="product-card"]')).length;
      if (afterCount === 2) break;
      await commands.wait(100);
    }
    expect(afterCount).to.equal(2);
  });
});
