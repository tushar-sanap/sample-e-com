const { describe, it, beforeEach, afterEach, after } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');

describe('WH-10', function () {
  this.timeout(40000);
  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    await testSetup.beforeEach(process.env.BROWSER || 'chrome');
    commands = testSetup.getCommands();
    await commands.visit('/products');
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  after(async function () {
    await commands.driver.executeScript('return window.__wh10.missing.toString()');
  });

  it('WH-10 Test', async function () {
    expect(true).to.be.true;
  });
});
