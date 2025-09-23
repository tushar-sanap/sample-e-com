const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-02', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.driver.executeScript('sessionStorage.clear()');
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('updates shortlist badge', async function () {
    await commands.visit('/flaky-lab');
    await commands.click('[data-testid="shortlist-btn-1"]');
    await commands.wait(300);
    const badge = await commands.get('[data-testid="shortlist-badge"]').then(el => el.getText());
    expect(parseInt(badge)).to.equal(1);
  });
});
