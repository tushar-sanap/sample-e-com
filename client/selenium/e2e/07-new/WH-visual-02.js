const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-Visual-02', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
  });

  afterEach(async function () { await testSetup.afterEach(); });

  it('Visual Test 2', async function () {
    await commands.visit('/experience');
    await commands.shouldBeVisible('[data-testid="profile-form"]');

    await commands.type('[data-testid="profile-form"] input', 'John');
    await commands.click('[data-testid="profile-submit"]');
    await commands.wait(800);

    const msg = await commands.get('[data-testid="profile-result"]').then(el => el.getText());
    expect(msg).to.equal('Submitted');
  });
});
