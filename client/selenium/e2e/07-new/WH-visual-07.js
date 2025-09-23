const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-07', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async () => { await testSetup.afterEach(); });

  it('Visual Test 7', async function () {
    await commands.visit('/experience');
    const tabs = await commands.getAll('[data-testid="tab-specs"]');
    await tabs[1].click(); 
    await commands.wait(200);
    const panel = await commands.get('[data-testid="panel-specs"]');
    const visible = await panel.isDisplayed();
    expect(visible).to.equal(true);
  });
});
