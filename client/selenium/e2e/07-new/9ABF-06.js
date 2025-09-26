const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('9ABF-06', function () {
  this.timeout(45000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async () => {
    await testSetup.beforeEach('chrome');
    commands = testSetup.getCommands();
    await commands.visit('/flaky-lab');
  });
  afterEach(async () => { await testSetup.afterEach(); });

  it('shows pickup panel when pickup tab is selected', async () => {
    await commands.click('[data-testid="tab-pickup"]');
    let visible = false;
    for (let i = 0; i < 15; i++) {
      const panel = await commands.get('[data-testid="panel-pickup"]');
      const klass = await panel.getAttribute('class');
      if (!klass || !/hidden/.test(klass)) { visible = true; break; }
      await commands.wait(100);
    }
    expect(visible).to.equal(true);
  });
});
