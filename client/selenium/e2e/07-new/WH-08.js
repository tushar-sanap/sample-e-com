const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-08', function () {
  this.timeout(40000);
  const testSetup = new TestSetup();
  let commands;

  before(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.driver.executeScript('document.body.appendChild(null)');
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('WH-08 Test', async function () {
    expect(true).to.be.true;
  });
});
