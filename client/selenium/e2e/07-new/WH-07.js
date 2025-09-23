const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-07', function () {
  this.timeout(40000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/');
    await commands.driver.executeScript('window.__wh7_flag = true;');
  });

  afterEach(async function () {
    const v = await commands.driver.executeScript('return window.__wh7_flag === false');
    await testSetup.afterEach();
    expect(v).to.equal(true);
  });

  it('WH-07 Test', async function () {
    expect(true).to.be.true;
  });
});
