const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('NFT-07-total-addition', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => { await testSetup.beforeEach('chrome'); commands = testSetup.getCommands(); });
  afterEach(async () => { await testSetup.afterEach(); });

  it('updates total after adding two items', async () => {
    await commands.visit('/flaky-lab');
    await commands.click('[data-testid="add-btn-1"]');
    await commands.click('[data-testid="add-btn-2"]');
    await commands.wait(200);
    const totalTxt = await commands.get('[data-testid="grand-total"]').then(x => x.getText());
    expect(totalTxt.replace(/[^\d.]/g, '')).to.equal('298.00');
  });
});
