const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-03', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async function () { await testSetup.afterEach(); });

  it('Visual Test 3', async function () {
    await commands.visit('/experience');
    const btn = await commands.get('[data-testid="proceed-btn"]');
    await commands.driver.actions({ bridge: true }).move({ origin: btn }).perform();
    await commands.wait(200);
    await btn.click();
    await commands.wait(1200);
    const layer = await commands.getAll('[data-testid="hint-layer"]');
    expect(layer.length).to.equal(0);
  });
});
