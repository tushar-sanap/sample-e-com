const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-05', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function () { await testSetup.afterEach(); });

  it('Visual Test 5', async function () {
    await commands.visit('/experience');
    const beforeUrl = await commands.driver.getCurrentUrl();

    await commands.click('[data-testid="continue-cta"]');
    await commands.wait(300);

    const afterUrl = await commands.driver.getCurrentUrl();
    expect(afterUrl).to.not.equal(beforeUrl);
  });
});
