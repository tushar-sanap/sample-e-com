const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-06', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
    await commands.driver.executeScript('sessionStorage.clear();');
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('increments shortlist badge', async () => {
    const before = await commands.get('[data-testid="shortlist-badge"]').then(x => x.getText());
    await commands.click('[data-testid="shortlist-btn-1"]');
    await commands.wait(200);
    const after = await commands.get('[data-testid="shortlist-badge"]').then(x => x.getText());
    expect(Number(after)).to.equal(Number(before) + 1);
  });
});
