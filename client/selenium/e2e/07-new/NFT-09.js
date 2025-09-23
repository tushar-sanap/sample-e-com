const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-09-tab', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async () => { await testSetup.afterEach(); });

  it('shows pickup panel when tab selected', async () => {
    await commands.visit('/flaky-lab');
    await commands.click('[data-testid="tab-pickup"]');
    await commands.wait(200);
    const klass = await commands.get('[data-testid="pickup-panel"]').then(el => el.getAttribute('class'));
    expect(klass).to.not.include('hidden');
  });
});
