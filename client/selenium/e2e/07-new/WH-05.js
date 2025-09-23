const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('WH-05 Hook Failure: afterEach detects state leak', function () {
  this.timeout(40000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    const browser = process.env.BROWSER || 'chrome';
    await testSetup.beforeEach(browser);
    commands = testSetup.getCommands();
  });

  afterEach(async function () {
    const leak = await commands.driver.executeScript(() => localStorage.getItem('__TEMP_TEST_FLAG__'));
    await testSetup.afterEach();
    expect(leak, 'Temporary test flag must be cleared in test/teardown').to.equal(null);
  });

  it('WH-05 Test', async function () {
    await commands.visit('/login');
    await commands.driver.executeScript(() => {
      localStorage.setItem('__TEMP_TEST_FLAG__', 'leftover'); 
    });
    expect(true).to.be.true; 
  });
});
