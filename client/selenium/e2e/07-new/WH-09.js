const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-09', function () {
  this.timeout(15000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.driver.executeScript('return new Promise(()=>{})');
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('WH-09 Test', async function () {
    expect(true).to.be.true;
  });
});
