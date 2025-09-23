const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const TestSetup = require('../../support/test-setup');


describe('WH-02', function () {
  this.timeout(30000);

  const testSetup = new TestSetup();
  let commands;

  beforeEach(async function () {
    const browser = process.env.BROWSER || 'chrome';
    await testSetup.beforeEach(browser);
    commands = testSetup.getCommands();

    await commands.visit('/products');

    
    await commands.get('#selector-nfl', 200);
  });

  afterEach(async function () {
    await testSetup.afterEach();
  });

  it('WH-02 Test', async function () {
    expect(true).to.equal(true); 
  });
});
