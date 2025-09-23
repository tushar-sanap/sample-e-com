const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-09', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async () => { await testSetup.afterEach(); });

  it('Visual Test 9', async function () {
    await commands.visit('/experience');
    await commands.type('[data-testid="delayi"]', 'secret-123');
    await commands.wait(150);
    const echo = await commands.get('[data-testid="delaye"]').then(e => e.getText());
    expect(echo).to.include('secret-123');
  });
});
