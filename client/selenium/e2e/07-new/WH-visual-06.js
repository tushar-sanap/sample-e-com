const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-06', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('Visual Test 6', async function () {
    await commands.visit('/experience');
    await commands.click('[data-testid="pref-toggle"]');
    await commands.wait(200);
    const txt = await commands.get('[data-testid="toggle-state"]').then(e => e.getText());
    expect(txt).to.include('ON');
  });
});
