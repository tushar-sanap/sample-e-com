const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('9ABF-04', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('shortlist badge starts at zero', async () => {
    const badge = await commands.get('[data-testid="shortlist-badge"]').then(x => x.getText());
    expect(badge).to.equal('0');
  });
});
